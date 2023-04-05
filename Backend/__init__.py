import os

from flask import Flask, render_template
import psycopg2
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import urllib.request, json
from flask_mqtt import Mqtt
from flask_caching import Cache


def create_app(test_config=None):
    
    db = SQLAlchemy()

    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    app.config["SECRET_KEY"] = 'dev'
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://home:admin@localhost:5432/home_db"

    CORS(app, resources={r'/*':{"origins":"*"}})
    app.config['CORS_HEADERS'] = 'Content-Type'


    app.config['MQTT_BROKER_URL'] = 'localhost'
    app.config['MQTT_BROKER_PORT'] = 1883
    app.config['MQTT_KEEPALIVE'] = 5  # Set KeepAlive time in seconds
    app.config['MQTT_TLS_ENABLED'] = False  # If your server supports TLS, set it True
    mqtt_client = Mqtt(app)

    cache = Cache(app)


    @mqtt_client.on_connect()
    def handle_connect(client, userdata, flags, rc):
        if rc == 0:
            print('Connected successfully')
            mqtt_client.subscribe('t')
            mqtt_client.subscribe('h') 
        else:
            print('Bad connection. Code:', rc)

    @mqtt_client.on_message()
    def handle_mqtt_message(client, userdata, message):
        data = {
            'topic' : message.topic,
            'payload' : message.payload.decode('utf-8')
        }
        if message.topic == 't':
            cache.set("room_temp", message.payload.decode('utf-8'))
        
        if message.topic == 'h':
            cache.set("room_humidity", message.payload.decode('utf-8'))

        print('Received message on topic: {topic} with payload: {payload}'.format(**data))


    
    db.init_app(app)
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

    class UserHome(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String, unique=True, nullable=False)

    with app.app_context():
        db.create_all()
    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'
    
    @app.route('/query')
    def query():
        
        users = UserHome.query.all()
        return render_template('db.html', users=users)

    return app