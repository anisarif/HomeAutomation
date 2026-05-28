import os
from flask import Flask
from .models import db
from sqlalchemy import text
from flask_cors import CORS
from .mqtt_client import mqtt, cache, init_extensions
from flask_socketio import SocketIO
import logging
from logging.handlers import RotatingFileHandler

socketio = SocketIO()

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    app.config.update(
        SECRET_KEY=os.getenv('SECRET_KEY', 'dev-secret-key'),
        SQLALCHEMY_DATABASE_URI=os.getenv('DATABASE_URI', "postgresql://home:admin@db:5432/home_db"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        MQTT_BROKER_URL=os.getenv('MQTT_BROKER_URL', 'mqtt'),
        MQTT_BROKER_PORT=int(os.getenv('MQTT_BROKER_PORT', 1883)),
        MQTT_KEEPALIVE=60,
        MQTT_TLS_ENABLED=False,
        CORS_HEADERS='Content-Type'
    )

    if test_config:
        app.config.update(test_config)
    elif os.path.exists(os.path.join(app.instance_path, 'config.py')):
        app.config.from_pyfile('config.py')

    db.init_app(app)

    with app.app_context():
        db.create_all()
        # Safe to run on every startup — IF NOT EXISTS is a no-op after first run
        try:
            with db.engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
                conn.execute(text("ALTER TYPE actuator_type ADD VALUE IF NOT EXISTS 'RGBLight'"))
        except Exception as e:
            app.logger.warning(f"RGB enum migration skipped: {e}")

    CORS(app, resources={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type"],
        }
    })

    init_extensions(app)
    socketio.init_app(app)

    try:
        os.makedirs(app.instance_path, mode=0o750)
    except OSError:
        pass

    from . import api
    app.register_blueprint(api.bp)

    @app.after_request
    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        return response

    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}, 200

    if not app.debug and not app.testing:
        log_dir = os.path.join(app.instance_path, 'logs')
        os.makedirs(log_dir, exist_ok=True)
        file_handler = RotatingFileHandler(
            os.path.join(log_dir, 'app.log'),
            maxBytes=10240000,
            backupCount=10
        )
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('HomeAutomation startup')

    return app
