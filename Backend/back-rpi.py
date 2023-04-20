from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import urllib.request, json
from flask_mqtt import Mqtt
from flask_caching import Cache
from datetime import datetime, timedelta, timezone
from flask_sqlalchemy import SQLAlchemy





app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URL'] = "postgresql://admin:admin@localhost:5432/homedb"

db = SQLAlchemy(app)


app.config["CACHE_TYPE"] = "SimpleCache" # better not use this type w. gunicorn
cache = Cache(app)
CORS(app, resources={r'/*':{"origins":"*"}})
app.config['CORS_HEADERS'] = 'Content-Type'


app.config['MQTT_BROKER_URL'] = 'localhost'
app.config['MQTT_BROKER_PORT'] = 1883
app.config['MQTT_KEEPALIVE'] = 5  # Set KeepAlive time in seconds
app.config['MQTT_TLS_ENABLED'] = False  # If your server supports TLS, set it True

mqtt_client = Mqtt(app)


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

acurators = {
   0 : {'id' : "0", 'pin' : 'D1', 'name' : "main", 'board' : "anis_room", 'type' : "light", 'state' : '0' },
   1 : {'id' : "1", 'pin' : 'D2', 'name' : "desk light", 'board' : "anis_room", 'type' : "light", 'state' : '0' },
   2 : {'id' : "2", 'pin' : 'D1', 'name' : "main", 'board' : "living_room", 'type' : "light", 'state' : '0' },
   3 : {'id' : "3", 'pin' : 'D2', 'name' : "kitchen", 'board' : "living_room", 'type' : "light", 'state' : '0' },
   4 : {'id' : "4", 'pin' : 'D3', 'name' : "main door", 'board' : "living_room", 'type' : "lock", 'state' : '0' },
}

@app.route("/")
def main():
   return jsonify(acurators)



@app.route("/Act", methods=['POST'])
def Act():
   
   id = request.json['id']
   id = int(id)

   action = request.json['action']

   if action == "1":
      mqtt_client.publish(acurators[id]['id'], "1")
      acurators[id]['state'] = action

   if action == "0":
      mqtt_client.publish(acurators[id]['id'], "0")
      acurators[id]['state'] = action

   return jsonify(acurators)

    
@app.route("/Weather/")
def weather():

   url_weather_api = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.43&current_weather=true&timezone=auto"

   response = urllib.request.urlopen(url_weather_api)
   external_weather = response.read()
   current = json.loads(external_weather)
   room_temp = cache.get("room_temp")
   room_humidity = cache.get("room_humidity")

   weather = {'temp': current['current_weather']['temperature'],
              'windspeed': current['current_weather']['windspeed'],
              'room_temp': room_temp,
              'room_humidity' : room_humidity,
   }

   return jsonify(weather)

if __name__ == "__main__":
   app.run(host='0.0.0.0', port=5000, debug=True)

