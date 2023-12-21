from flask import current_app
from flask_mqtt import Mqtt
from flask_caching import Cache

from Backend.models import Actuators


mqtt = Mqtt()
cache = Cache(config={'CACHE_TYPE': 'simple'})

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

    with current_app.app_context():
        actuator = Actuators.query.filter_by(id=message.topic).first()

        if actuator:
            print(actuator);



@mqtt.on_subscribe()
def on_subscribe(client, userdata, mid, granted_qos):
    print('Subscribed userdata mid {} with QoS: {}'.format( mid, granted_qos))