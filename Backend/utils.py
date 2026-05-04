from .mqtt_client import mqtt
from flask import request

def Action(id):
    data = request.get_json()
    state = data['state']
    if state is not None:
        action = "0" if state == False else "1"
        mqtt.publish(str(id), action)
        return (action + " " + str(id) + " is done", 200)
    return ("No state in data", 400)
