import os
from functools import wraps
from flask import Flask, request, jsonify
from .models import db
from flask_cors import CORS
from flask_jwt_extended import JWTManager, get_jwt, verify_jwt_in_request, create_access_token, get_jwt_identity, set_access_cookies
from flask_mqtt import Mqtt
from flask_caching import Cache
from werkzeug.security import generate_password_hash
from datetime import timedelta, datetime, timezone
from .utils import admin_required

mqtt = Mqtt()


def create_app(test_config=None):

    # create and configure the app

    app = Flask(__name__, instance_relative_config=True)

    app.config["SECRET_KEY"] = 'dev'
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://home:admin@localhost:5432/home_db"
    db.init_app(app)

    with app.app_context():
        db.create_all()

        from .models import UserHome  # Import your UserHome model here
        # Check if the default user already exists
        user = UserHome.query.filter_by(username='admin').first()
        if user is None:
            # If the user doesn't exist, create it
            user = UserHome(username='admin', password=generate_password_hash('admin'), role='admin')
            db.session.add(user)
            db.session.commit()

    # Setup the Flask-Cors
    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'

    # Setup the Flask-JWT-Extended

    app.config["JWT_SECRET_KEY"] = "super-secret"
    # If true this will only allow the cookies that contain your JWTs to be sent
    # over https. In production, this should always be set to True
    app.config["JWT_COOKIE_SECURE"] = False
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=90)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(weeks=4)
    jwt = JWTManager(app)


    # Setup the Flask-MQTT

    app.config['MQTT_BROKER_URL'] = '192.168.178.171'
    app.config['MQTT_BROKER_PORT'] = 1883
    app.config['MQTT_KEEPALIVE'] = 5  # Set KeepAlive time in seconds
    # If your server supports TLS, set it True
    app.config['MQTT_TLS_ENABLED'] = False

    mqtt.init_app(app)


    @mqtt.on_connect()
    def handle_connect(client, userdata, flags, rc):
        if rc == 0:
            print('Connected successfully')
            mqtt.subscribe('t')
            mqtt.subscribe('h')
            mqtt.subscribe('1')

        else:
            print('Bad connection. Code:', rc)

    @mqtt.on_message()
    def handle_mqtt_message(client, userdata, message):
        data = {
            'topic': message.topic,
            'payload': message.payload.decode('utf-8')
        }
        if message.topic == 't':
            cache.set("room_temp", message.payload.decode('utf-8'))

        if message.topic == 'h':
            cache.set("room_humidity", message.payload.decode('utf-8'))

        print(
            'Received message on topic: {topic} with payload: {payload}'.format(**data))

    app.config['CACHE_TYPE'] = 'simple'
       
    cache = Cache(app)

     

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import auth
    app.register_blueprint(auth.bp)

    from . import api
    app.register_blueprint(api.bp)

    @app.route('/')
    @admin_required()
    def index():
        return 'Hello, World!'

    

    return app
