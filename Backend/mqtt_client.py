from flask_mqtt import Mqtt
from flask_caching import Cache


mqtt = Mqtt()
cache = Cache(config={'CACHE_TYPE': 'simple'})

@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    if rc == 0:
        print('Connected successfully')
        mqtt.subscribe('t')
        mqtt.subscribe('h')
        mqtt.subscribe('3')
        mqtt.subscribe('2')
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

