from .mqtt_client import mqtt
from flask import request
import json

def Action(id):
    data = request.get_json()
    state = data['state']
    if state is not None:
        action = "0" if state == False else "1"
        mqtt.publish(str(id), action)
        return (action + " " + str(id) + " is done", 200)
    return ("No state in data", 400)


# ------------------------------------------------------------------ #
# AC (IR) helpers
#
# All AC traffic uses structured JSON topics `ac/<topic_key>/{send,learn,captured}`.
# Commands are published QoS1 (a silently dropped AC command is worse than a
# dropped light toggle) and retain=False (a retained command would re-fire on
# every ESP reconnect and toggle the AC unexpectedly).
# ------------------------------------------------------------------ #

def send_ac_state(key, state):
    """Publish a protocol-based state frame the ESP builds via IRac.

    `state` is a dict {protocol, power, mode, temp, fan}.
    """
    payload = {"kind": "state", **state}
    mqtt.publish(f"ac/{key}/send", json.dumps(payload), qos=1, retain=False)


def send_ac_raw(key, payload):
    """Publish a raw/protocol IR command previously learned.

    `payload` is the parsed JSON stored on an IRCommand, e.g.
    {"kind": "raw", "freq": 38, "raw": [...]} or a {"kind": "state", ...} dict.
    """
    if "kind" not in payload:
        payload = {"kind": "raw", **payload}
    mqtt.publish(f"ac/{key}/send", json.dumps(payload), qos=1, retain=False)


def set_learn(key, enable, ttl=30):
    """Toggle the ESP's IR learn mode."""
    payload = {"enable": bool(enable), "ttl": ttl}
    mqtt.publish(f"ac/{key}/learn", json.dumps(payload), qos=1, retain=False)
