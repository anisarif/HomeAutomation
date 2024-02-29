from flask_mqtt import Mqtt
from flask_caching import Cache
from flask_socketio import SocketIO
from flask import Flask, current_app
#from Backend.models import UserHome

mqtt = Mqtt()
cache = Cache(config={'CACHE_TYPE': 'simple'})
socketio = SocketIO()

def init_extensions(app):
    mqtt.init_app(app)
    cache.init_app(app)
    socketio.init_app(app, cors_allowed_origins='*')

@socketio.on('publish')
def handle_publish(json_str):
    data = json.loads(json_str)
    mqtt.publish(data['topic'], data['message'])
        
        
@socketio.on('subscribe')
def handle_subscribe(json_str):
    data = json.loads(json_str)
    mqtt.subscribe(data['topic'])
        
        
@socketio.on('unsubscribe_all')
def handle_unsubscribe_all():
    mqtt.unsubscribe_all()

@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    if rc == 0:
        print('Connected successfully')
        mqtt.subscribe('t',1)
        mqtt.subscribe('h',2)
        mqtt.subscribe('#')
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

    print('Received message on topic: {topic} with payload: {payload}'.format(**data))
    socketio.emit('mqtt_message', data=data)

@mqtt.on_subscribe()
def on_subscribe(client, userdata, mid, granted_qos):
    print('Subscribed userdata mid {} with QoS: {}'.format( mid, granted_qos))