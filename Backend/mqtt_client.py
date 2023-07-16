from flask_mqtt import Mqtt


mqtt = Mqtt()


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
        print("room_temp", message.payload.decode('utf-8'))

    if message.topic == 'h':
        print("room_humidity", message.payload.decode('utf-8'))

    print(
        'Received message on topic: {topic} with payload: {payload}'.format(**data))
