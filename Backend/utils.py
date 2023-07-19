from functools import wraps
from flask_jwt_extended import get_jwt, verify_jwt_in_request
from .mqtt_client import mqtt
from flask import request, jsonify

# Creating a custom decorator @admin_required to check user.role in the jwt access token as additional claims

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt()
        if not claims["is_administrator"]:
            return jsonify(msg='Admins only!'), 403
        else:
            return fn(*args, **kwargs)
    return wrapper

# Mqtt Action function

def Action(id):
    data = request.get_json()
    state = data['state']

    if state == False:
        action = "0"

    if state == True:
        action = "1"

    mqtt.publish(str(id), action)

    return action + " " + str(id) + " is done"
