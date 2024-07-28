import os
from flask import Flask, redirect, request
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

socketio = SocketIO()
limiter = Limiter(key_func=get_remote_address)

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    app.config["SECRET_KEY"] = os.getenv('SECRET_KEY', 'dev')
    app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY', 'super-secret')
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('DATABASE_URI', "postgresql://home:admin@localhost:5432/home_db")

    db.init_app(app)

    with app.app_context():
        db.create_all()
        from .models import UserHome
        user = UserHome.query.filter_by(username='admin').first()
        if user is None:
            user = UserHome(username='admin', password=generate_password_hash('admin'), role='admin')
            db.session.add(user)
            db.session.commit()

    CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'

    app.config["JWT_COOKIE_SECURE"] = True
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=90)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(weeks=4)
    jwt = JWTManager(app)

    app.config['MQTT_BROKER_PORT'] = 1883
    app.config['MQTT_KEEPALIVE'] = 5
    app.config['MQTT_TLS_ENABLED'] = False

    init_extensions(app)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import auth
    app.register_blueprint(auth.bp)

    from . import api
    app.register_blueprint(api.bp)

    @app.before_request
    def before_request():
        if not request.is_secure:
            url = request.url.replace("http://", "https://", 1)
            return redirect(url, code=301)

    app.config.update(
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SECURE=True,
        PERMANENT_SESSION_LIFETIME=timedelta(minutes=30)
    )

    limiter.init_app(app)

    csp = {
        'default-src': ["'self'"],
        'script-src': ["'self'", 'https://trusted.cdn.com'],
    }
    Talisman(app, content_security_policy=csp)

    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    @app.before_request
    def log_request_info():
        logger.info('Headers: %s', request.headers)
        logger.info('Body: %s', request.get_data())

    return app
