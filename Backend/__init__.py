import os
from flask import Flask, redirect, request, current_app
from .models import db
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .mqtt_client import mqtt, cache, init_extensions
from werkzeug.security import generate_password_hash
from datetime import timedelta
from flask_socketio import SocketIO
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
import secrets
import logging
from logging.handlers import RotatingFileHandler
import ssl
from functools import wraps
import time
socketio = SocketIO()
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="redis://localhost:6379"
)

def require_api_key(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if not api_key or api_key != current_app.config['API_KEY']:
            return {'message': 'Invalid API key'}, 401
        return f(*args, **kwargs)
    return decorated

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    # Security Configuration
    app.config.update(
        # Generate strong secret keys
        SECRET_KEY=os.getenv('SECRET_KEY', secrets.token_hex(32)),
        JWT_SECRET_KEY=os.getenv('JWT_SECRET_KEY', secrets.token_hex(32)),
        API_KEY=os.getenv('API_KEY', secrets.token_hex(32)),
        
        # Database Configuration
        SQLALCHEMY_DATABASE_URI=os.getenv('DATABASE_URI', "postgresql://home:admin@localhost:5432/home_db"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        
        # Session Security
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_SAMESITE='Strict',
        PERMANENT_SESSION_LIFETIME=timedelta(minutes=30),
        
        # JWT Configuration
        JWT_COOKIE_SECURE=True,
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(minutes=30),
        JWT_REFRESH_TOKEN_EXPIRES=timedelta(days=7),
        JWT_COOKIE_CSRF_PROTECT=True,
        JWT_ACCESS_CSRF_HEADER_NAME="X-CSRF-TOKEN",
        
        # MQTT Security Configuration
        MQTT_BROKER_PORT=8883,  # TLS port
        MQTT_KEEPALIVE=60,
        MQTT_TLS_ENABLED=True,
        MQTT_TLS_VERSION=ssl.PROTOCOL_TLS,
        MQTT_TLS_CERT_REQS=ssl.CERT_REQUIRED,
        MQTT_TLS_CA_CERTS=os.getenv('MQTT_TLS_CA_CERTS', 'path/to/ca.crt'),
        MQTT_TLS_CERTFILE=os.getenv('MQTT_TLS_CERTFILE', 'path/to/client.crt'),
        MQTT_TLS_KEYFILE=os.getenv('MQTT_TLS_KEYFILE', 'path/to/client.key'),
        
        # CORS Configuration
        CORS_HEADERS='Content-Type'
    )

    if test_config:
        app.config.update(test_config)
    elif os.path.exists(os.path.join(app.instance_path, 'config.py')):
        app.config.from_pyfile('config.py')

    db.init_app(app)

    max_retries = 3
    for attempt in range(max_retries):
        try:
            with app.app_context():
                db.create_all()
                from .models import UserHome

                admin_password = os.getenv('ADMIN_PASSWORD', secrets.token_urlsafe(16))
                user = UserHome.query.filter_by(username='admin').first()
                if user is None:
                    user = UserHome(
                        username='admin',
                        password=generate_password_hash(admin_password, method='pbkdf2:sha256:260000'),
                        role='admin'
                    )
                    db.session.add(user)
                    db.session.commit()
                    app.logger.info(f"Admin user created. Password: {admin_password}")
            break
        except Exception as e:
            if attempt == max_retries - 1:
                app.logger.error(f"Failed to initialize database after {max_retries} attempts: {e}")
                raise
            app.logger.warning(f"Database initialization attempt {attempt + 1} failed: {e}")
            time.sleep(5)
    # CORS Configuration with enhanced security
    CORS(app, resources={
        r"/api/*": {
            "origins": os.getenv('ALLOWED_ORIGINS', 'https://yourdomain.com').split(','),
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-CSRF-TOKEN", "X-API-Key"],
            "expose_headers": ["Content-Range", "X-Content-Range"],
            "supports_credentials": True,
            "max_age": 600
        }
    })

    # JWT Configuration
    jwt = JWTManager(app)

    @jwt.token_verification_failed_loader
    def token_verification_failed_callback(jwt_header, jwt_payload):
        return {'message': 'Invalid token'}, 401

    # Initialize extensions
    init_extensions(app)
    socketio.init_app(app)

    # Create instance directory securely
    try:
        os.makedirs(app.instance_path, mode=0o750)
    except OSError:
        pass

    # Blueprint registration
    from . import auth, api
    app.register_blueprint(auth.bp)
    app.register_blueprint(api.bp)

    # Security headers and HTTPS redirect
    @app.before_request
    def before_request():
        if not request.is_secure and not app.testing:
            url = request.url.replace('http://', 'https://', 1)
            return redirect(url, code=301)

    # Content Security Policy
    csp = {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'font-src': ["'self'"],
        'connect-src': ["'self'"],
        'frame-ancestors': ["'none'"],
        'form-action': ["'self'"],
        'base-uri': ["'self'"],
        'object-src': ["'none'"]
    }

    # Initialize Talisman with security headers
    Talisman(app,
        force_https=True,
        strict_transport_security=True,
        session_cookie_secure=True,
        content_security_policy=csp,
        content_security_policy_report_only=False,
        feature_policy={
            'geolocation': "'none'",
            'midi': "'none'",
            'notifications': "'none'",
            'push': "'none'",
            'sync-xhr': "'none'",
            'microphone': "'none'",
            'camera': "'none'",
            'magnetometer': "'none'",
            'gyroscope': "'none'",
            'speaker': "'none'",
            'vibrate': "'none'",
            'fullscreen': "'none'",
            'payment': "'none'"
        }
    )

    # Configure logging
    if not app.debug and not app.testing:
        log_dir = os.path.join(app.instance_path, 'logs')
        os.makedirs(log_dir, exist_ok=True)
        
        file_handler = RotatingFileHandler(
            os.path.join(log_dir, 'app.log'),
            maxBytes=10240000,  # 10MB
            backupCount=10
        )
        
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s '
            '[in %(pathname)s:%(lineno)d]'
        ))
        
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('HomeAutomation startup')

    # Request logging with sensitive data filtering
    @app.before_request
    def log_request_info():
        # Skip logging for health check endpoints
        if request.path == '/health':
            return

        # Create sanitized headers dictionary
        sensitive_headers = ['Authorization', 'Cookie', 'X-API-Key']
        safe_headers = {k: '***' if k in sensitive_headers else v 
                       for k, v in request.headers.items()}
        
        # Log sanitized request information
        app.logger.info(
            'Request: %s %s %s\nHeaders: %s',
            request.method,
            request.path,
            request.remote_addr,
            safe_headers
        )

    # Add health check endpoint
    @app.route('/health')
    @limiter.exempt
    def health_check():
        return {'status': 'healthy'}, 200

    return app