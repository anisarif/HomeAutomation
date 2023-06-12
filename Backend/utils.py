from functools import wraps
from flask_jwt_extended import get_jwt, verify_jwt_in_request
from flask_mqtt import Mqtt
from flask import request

  
mqtt = Mqtt()

# Creating a custom decorator @admin_required to check user.role in the jwt access token as additional claims

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims["is_administrator"]:
                return fn(*args, **kwargs)
            else:
                return 'admin only', 403

        return decorator

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
