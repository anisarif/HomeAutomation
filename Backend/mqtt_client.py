from flask_mqtt import Mqtt
from flask_caching import Cache
from flask_socketio import SocketIO
from flask import Flask, current_app
from Backend.models import UserHome, Boards
from flask_mqtt import Mqtt
from .device_security import DeviceSecurity
import ssl
import json
import hmac
import time

class SecureMQTTClient:
    def __init__(self, app):
        # MQTT TLS Configuration
        #app.config['MQTT_BROKER_PORT'] = 8883  # TLS port
        app.config['MQTT_BROKER_URL'] = 'mqtt'
        app.config['MQTT_BROKER_PORT'] = 1883
        app.config['MQTT_TLS_ENABLED'] = False
        #app.config['MQTT_TLS_VERSION'] = ssl.PROTOCOL_TLS
        #app.config['MQTT_TLS_CERT_REQS'] = ssl.CERT_REQUIRED
        #app.config['MQTT_TLS_CA_CERTS'] = 'Backend/certs/ca.crt'
        #app.config['MQTT_TLS_CERTFILE'] = 'Backend/certs/client.crt'
        #app.config['MQTT_TLS_KEYFILE'] = 'Backend/certs/client.key'
        
        self.mqtt = Mqtt(app)
        self.device_security = DeviceSecurity()
        
        # Set up MQTT callbacks
        self.mqtt.on_connect = self.handle_connect
        self.mqtt.on_message = self.handle_message

    def handle_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT broker successfully")
            # Subscribe to device topics
            self.mqtt.subscribe('devices/+/status')  # + is wildcard for device_id
        else:
            print(f"Failed to connect to MQTT broker with code: {rc}")

    def handle_message(self, client, userdata, message):
        """Handle incoming MQTT messages with signature verification"""
        try:
            payload = json.loads(message.payload.decode())
            device_id = payload.get('device_id')
            timestamp = payload.get('timestamp')
            signature = payload.get('signature')
            data = payload.get('data')

            # Verify message is recent (prevent replay attacks)
            if abs(time.time() - timestamp) > 300:  # 5 minute threshold
                print(f"Rejected message from {device_id}: timestamp too old")
                return

            # Verify device and signature
            device = Boards.query.filter_by(id=device_id).first()
            if not device:
                print(f"Unknown device: {device_id}")
                return

            expected_signature = self.device_security.generate_message_signature(
                device.secret_hash, json.dumps(data), timestamp
            )

            if not hmac.compare_digest(signature, expected_signature):
                print(f"Invalid signature from device: {device_id}")
                return

            # Process verified message
            self.process_verified_message(device_id, data)

        except json.JSONDecodeError:
            print("Invalid JSON payload received")
        except Exception as e:
            print(f"Error processing MQTT message: {str(e)}")

    def publish_secure(self, device_id, message):
        """Publish message with security headers"""
        timestamp = int(time.time())
        payload = {
            "device_id": device_id,
            "timestamp": timestamp,
            "data": message,
            "signature": self.device_security.generate_message_signature(
                device_id, json.dumps(message), timestamp
            )
        }
        topic = f"devices/{device_id}/command"
        self.mqtt.publish(topic, json.dumps(payload))

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