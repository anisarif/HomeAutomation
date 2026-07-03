import json
from flask import request, Blueprint, jsonify
from .models import db, UserHome, Boards, Actuators, LockActions, ACUnit, IRCommand
from .utils import Action, send_ac_state, send_ac_raw, set_learn
from .mqtt_client import cache, mqtt
from marshmallow import Schema, fields, validate, ValidationError

bp = Blueprint('api', __name__, url_prefix='/api')

##################################
################################## USERS ##################################
##################################

class UserSchema(Schema):
    username = fields.String(required=True, validate=validate.Length(min=1))
    role = fields.String(load_default="user", validate=validate.OneOf(["admin", "user"]))

@bp.route("/user/add", methods=['POST'])
def adduser():
    data = request.get_json()
    try:
        validated_data = UserSchema().load(data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    user = UserHome(username=validated_data['username'], role=validated_data['role'])
    db.session.add(user)
    db.session.commit()
    return 'user added'

@bp.route("/user/getall")
def getusers():
    res = UserHome.query.all()
    list = []
    for user in res:
        users = {
            "id": user.id,
            "username": user.username,
            "role": user.role,
        }
        list.append(users)
    return jsonify(list)

@bp.route("/user/get/<int:id>")
def getuser_id(id):
    user = UserHome.query.filter_by(id=id).first()
    return jsonify({
        "id": user.id,
        "username": user.username,
        "role": user.role
    })

@bp.route("/user/update/<int:id>", methods=['PUT'])
def updateuser(id):
    user = UserHome.query.filter_by(id=id).first()
    if user:
        data = request.get_json()
        user.username = data['username']
        user.role = data['role']
        db.session.commit()
    return str(f"user {user.username} updated")

@bp.route("/user/delete/<int:id>", methods=['DELETE'])
def deleteuser(id):
    user = UserHome.query.filter_by(id=id).first()
    if user:
        db.session.delete(user)
        db.session.commit()
    return f"user {id} deleted"

@bp.route('/user/boards/<int:current_id>')
def get_user_boards(current_id):
    user = UserHome.query.filter_by(id=current_id).first()
    if not user:
        return jsonify({'error': 'User not found'})

    boards = []
    boards.extend(Boards.query.filter_by(privacy='public').all())
    boards.extend(user.boards)
    board_list = [{'id': board.id, 'name': board.name} for board in boards]
    return jsonify(board_list)

##################################
################################## BOARDS ##################################
##################################

@bp.route("/board/add", methods=['POST'])
def addboard():
    data = request.get_json()
    name = data['name']
    privacy = data['privacy']

    if privacy == "public":
        users = UserHome.query.all()
        board = Boards(name=name, privacy=privacy, users=users)
    else:
        user_ids = data['users']
        users = UserHome.query.filter(UserHome.id.in_(user_ids)).all()
        board = Boards(name=name, privacy=privacy, users=users)

    db.session.add(board)
    db.session.commit()
    return 'board added'

@bp.route("/board/getall")
def getboards():
    res = Boards.query.all()
    list = []
    for board in res:
        boards = {
            "id": board.id,
            "name": board.name,
            "privacy": board.privacy,
        }
        list.append(boards)
    return jsonify(list)

@bp.route("/board/get/<int:id>")
def getboard(id):
    board = Boards.query.filter_by(id=id).first()
    return board

@bp.route("/board/update/<int:id>", methods=['PUT'])
def updateBoard(id):
    board = Boards.query.filter_by(id=id).first()
    if board:
        data = request.get_json()
        board.name = data['name']
        board.privacy = data['privacy']
        if board.privacy == "public":
            board.users = UserHome.query.all()
        else:
            user_ids = data['users']
            users = UserHome.query.filter(UserHome.id.in_(user_ids)).all()
            board.users = users

        db.session.commit()
    return str(f"board {board.name} updated")

@bp.route("/board/delete/<int:id>", methods=['DELETE'])
def deleteboard(id):
    board = Boards.query.filter_by(id=id).first()
    if board:
        db.session.delete(board)
        db.session.commit()
    return f"Board {id} deleted"

##################################
################################## ACTUATORS ##################################
##################################

@bp.route("/actuator/add", methods=['POST'])
def addactuator():
    data = request.get_json()
    name = data['name']
    pin = data['pin']
    board_id = data['board_id']
    type = data['type']
    actuator = Actuators(name=name, pin=int(pin), board_id=int(board_id), type=type, state=0)
    db.session.add(actuator)
    db.session.commit()
    return "actuator added"

@bp.route("/actuator/getall")
def getactuators():
    res = Actuators.query.all()
    list = []
    for actuator in res:
        actuators = {
            "id": actuator.id,
            "name": actuator.name,
            "pin": actuator.pin,
            "board_id": actuator.board_id,
            "type": actuator.type,
            "state": actuator.state,
        }
        list.append(actuators)
    return jsonify(list)

@bp.route("/actuator/get/<int:id>")
def getactuator(id):
    actuator = Actuators.query.filter_by(id=id).first()
    if actuator:
        return jsonify({
            "id": actuator.id,
            "name": actuator.name,
            "pin": actuator.pin,
            "board_id": actuator.board_id,
            "type": actuator.type,
            "state": actuator.state,
        })

@bp.route("/actuator/updateState/<int:id>", methods=['PUT'])
def update_actuator_state(id):
    actuator = Actuators.query.filter_by(id=id).first()
    if actuator:
        state = request.get_json('state')
        if state['state'] == False:
            actuator.state = 0
            db.session.commit()
            lock_action = LockActions(user_id=1, board_id=actuator.board_id, actuator_id=id, state=0)
            db.session.add(lock_action)
            db.session.commit()
            return f"Actuator id: {id} updated to false"
        elif state['state'] == True:
            actuator.state = 1
            db.session.commit()
            lock_action = LockActions(user_id=1, board_id=actuator.board_id, actuator_id=id, state=1)
            db.session.add(lock_action)
            db.session.commit()
            return f"Actuator id: {id} updated to true"
        return "error while updating actuator state", 400
    else:
        return "actuator not found"

@bp.route("/actuator/update/<int:id>", methods=['PUT'])
def updateactuator(id):
    actuator = Actuators.query.filter_by(id=id).first()
    if actuator:
        data = request.get_json()
        actuator.name = data['name']
        actuator.pin = data['pin']
        actuator.board_id = data['board_id']
        actuator.type = data['type']
        db.session.commit()
    return f"actuator id: {id} updated"

@bp.route("/actuator/delete/<int:id>", methods=['DELETE'])
def deleteactuator(id):
    actuator = Actuators.query.filter_by(id=id).first()
    if actuator:
        db.session.delete(actuator)
        db.session.commit()
    return f"actuator {id} deleted"

@bp.route("/actuator/toggle/<int:id>", methods=['POST'])
def toggle_actuator(id):
    actuator = Actuators.query.filter_by(id=id).first()
    if not actuator:
        return "actuator not found", 404
    data = request.get_json()
    state = data['state']
    actuator.state = 1 if state else 0
    lock_action = LockActions(user_id=1, board_id=actuator.board_id, actuator_id=id, state=state)
    db.session.add(lock_action)
    db.session.commit()
    mqtt.publish(str(id), "1" if state else "0")
    return jsonify({"state": state})

@bp.route("/act/<int:id>", methods=['POST'])
def actionmqtt(id):
    Action(id)
    return f"Action triggered for ID: {id}"

@bp.route("/rgb/<int:id>", methods=['POST'])
def set_rgb(id):
    data = request.get_json()
    r      = max(0, min(255, int(data.get('r', 0))))
    g      = max(0, min(255, int(data.get('g', 0))))
    b      = max(0, min(255, int(data.get('b', 0))))
    effect = data.get('effect', 'solid')
    speed  = max(1, min(10, int(data.get('speed', 5))))
    cache.set(f'rgb_{id}', {'r': r, 'g': g, 'b': b, 'effect': effect, 'speed': speed})
    payload = json.dumps({
        "effect": effect,
        "speed":  speed,
        "r": round(r * 1023 / 255),
        "g": round(g * 1023 / 255),
        "b": round(b * 1023 / 255),
    })
    mqtt.publish(str(id), payload)
    return jsonify({"status": "ok"})

@bp.route("/rgb/<int:id>", methods=['GET'])
def get_rgb(id):
    state = cache.get(f'rgb_{id}') or {'r': 0, 'g': 0, 'b': 0}
    return jsonify(state)

@bp.route("/sensor/temp_hum/", methods=['GET'])
def sensor_temp_hum():
    temp = cache.get('room_temp')
    hum = cache.get('room_humidity')
    return jsonify({"temp": temp, "hum": hum})

@bp.route("/getHistory", methods=['GET'])
def getHistory():
    res = LockActions.query.all()
    list = []
    for action in res:
        actions = {
            "id": action.id,
            "user_id": action.user_id,
            "board_id": action.board_id,
            "actuator_id": action.actuator_id,
            "state": str(action.state),
            "date": action.time,
        }
        list.append(actions)
    return jsonify(list)

@bp.route("/getActions", methods=['GET'])
def getActions():
    res = LockActions.query.all()
    actions_list = []

    for action in res:
        device_id = action.actuator_id
        timestamp = action.time
        state = str(action.state)

        if state == 'True':
            actions_list.append({
                'id': action.id,
                'user_id': action.user_id,
                'board_id': action.board_id,
                'actuator_id': device_id,
                'state': state,
                'start': timestamp,
            })
        elif state == 'False' and actions_list:
            last_action = actions_list[-1]
            last_action['end'] = timestamp

    return jsonify(actions_list)

##################################
################################## AUTO MODE ##################################
##################################

# In-memory auto-mode state per actuator ID. Defaults to True (enabled).
# Resets to True on restart — safe default for presence-controlled lights.
_auto_mode = {}  # {actuator_id: bool}, default True

@bp.route("/auto-mode/<int:id>", methods=["GET"])
def get_auto_mode(id):
    return jsonify({"id": id, "enabled": _auto_mode.get(id, True)})

@bp.route("/auto-mode/<int:id>", methods=["POST"])
def set_auto_mode(id):
    data = request.get_json()
    if data is None or "enabled" not in data:
        return jsonify({"error": "missing enabled field"}), 400
    _auto_mode[id] = bool(data["enabled"])
    return jsonify({"id": id, "enabled": _auto_mode[id]})

##################################
################################## AC (IR) ##################################
##################################

class ACStateSchema(Schema):
    power = fields.Boolean(required=True)
    mode = fields.String(required=True, validate=validate.OneOf(
        ["cool", "heat", "dry", "fan", "auto"]))
    temp = fields.Integer(required=True, validate=validate.Range(min=16, max=30))
    fan = fields.String(required=True, validate=validate.OneOf(
        ["auto", "low", "med", "high"]))


def _ac_dict(ac):
    return {
        "id": ac.id,
        "name": ac.name,
        "topic_key": ac.topic_key,
        "board_id": ac.board_id,
        "protocol": ac.protocol,
        "power": ac.power,
        "mode": ac.mode,
        "temp": ac.temp,
        "fan": ac.fan,
    }


def _command_dict(cmd):
    return {
        "id": cmd.id,
        "ac_id": cmd.ac_id,
        "name": cmd.name,
        "protocol": cmd.protocol,
        "payload": cmd.payload,
        "category": cmd.category,
    }


@bp.route("/ac/add", methods=['POST'])
def add_ac():
    data = request.get_json()
    ac = ACUnit(
        name=data['name'],
        topic_key=data['topic_key'],
        board_id=data.get('board_id'),
        protocol=data.get('protocol'),
    )
    db.session.add(ac)
    db.session.commit()
    return jsonify(_ac_dict(ac)), 201


@bp.route("/ac/getall")
def get_acs():
    return jsonify([_ac_dict(ac) for ac in ACUnit.query.all()])


@bp.route("/ac/get/<int:id>")
def get_ac(id):
    ac = ACUnit.query.filter_by(id=id).first()
    if not ac:
        return jsonify({"error": "AC not found"}), 404
    return jsonify(_ac_dict(ac))


@bp.route("/ac/update/<int:id>", methods=['PUT'])
def update_ac(id):
    ac = ACUnit.query.filter_by(id=id).first()
    if not ac:
        return jsonify({"error": "AC not found"}), 404
    data = request.get_json()
    ac.name = data.get('name', ac.name)
    ac.topic_key = data.get('topic_key', ac.topic_key)
    ac.board_id = data.get('board_id', ac.board_id)
    ac.protocol = data.get('protocol', ac.protocol)
    db.session.commit()
    return jsonify(_ac_dict(ac))


@bp.route("/ac/delete/<int:id>", methods=['DELETE'])
def delete_ac(id):
    ac = ACUnit.query.filter_by(id=id).first()
    if ac:
        db.session.delete(ac)
        db.session.commit()
    return f"AC {id} deleted"


@bp.route("/ac/<int:unit_id>/state", methods=['POST'])
def set_ac_state(unit_id):
    ac = ACUnit.query.filter_by(id=unit_id).first()
    if not ac:
        return jsonify({"error": "AC not found"}), 404
    try:
        state = ACStateSchema().load(request.get_json())
    except ValidationError as err:
        return jsonify(err.messages), 400

    ac.power = state['power']
    ac.mode = state['mode']
    ac.temp = state['temp']
    ac.fan = state['fan']
    db.session.commit()

    send_ac_state(ac.topic_key, {"protocol": ac.protocol, **state})
    return jsonify(_ac_dict(ac))


@bp.route("/ac/<int:unit_id>/commands", methods=['GET'])
def get_ac_commands(unit_id):
    ac = ACUnit.query.filter_by(id=unit_id).first()
    if not ac:
        return jsonify({"error": "AC not found"}), 404
    cmds = IRCommand.query.filter_by(ac_id=unit_id).all()
    return jsonify([_command_dict(c) for c in cmds])


@bp.route("/ac/<int:unit_id>/commands", methods=['POST'])
def add_ac_command(unit_id):
    """Save a learned code as an IRCommand.

    Body: {"name": "...", "payload": {...}, "category": "...", "protocol": "..."}.
    `payload` is the captured JSON object (raw array or protocol value+bits).
    """
    ac = ACUnit.query.filter_by(id=unit_id).first()
    if not ac:
        return jsonify({"error": "AC not found"}), 404
    data = request.get_json()
    payload = data['payload']
    if not isinstance(payload, str):
        payload = json.dumps(payload)
    cmd = IRCommand(
        ac_id=unit_id,
        name=data['name'],
        protocol=data.get('protocol', 'RAW'),
        payload=payload,
        category=data.get('category'),
    )
    db.session.add(cmd)
    db.session.commit()
    return jsonify(_command_dict(cmd)), 201


@bp.route("/ac/commands/<int:cmd_id>", methods=['DELETE'])
def delete_ac_command(cmd_id):
    cmd = IRCommand.query.filter_by(id=cmd_id).first()
    if cmd:
        db.session.delete(cmd)
        db.session.commit()
    return f"command {cmd_id} deleted"


@bp.route("/ac/<int:unit_id>/send/<int:command_id>", methods=['POST'])
def send_ac_command(unit_id, command_id):
    ac = ACUnit.query.filter_by(id=unit_id).first()
    cmd = IRCommand.query.filter_by(id=command_id, ac_id=unit_id).first()
    if not ac or not cmd:
        return jsonify({"error": "AC or command not found"}), 404
    try:
        payload = json.loads(cmd.payload)
    except (json.JSONDecodeError, TypeError):
        return jsonify({"error": "stored command payload is not valid JSON"}), 500
    send_ac_raw(ac.topic_key, payload)
    return f"command {command_id} sent to AC {unit_id}"


@bp.route("/ac/<int:unit_id>/learn", methods=['POST'])
def ac_learn(unit_id):
    ac = ACUnit.query.filter_by(id=unit_id).first()
    if not ac:
        return jsonify({"error": "AC not found"}), 404
    data = request.get_json() or {}
    enable = data.get('enable', True)
    # Clear any stale capture before (re)entering learn mode, so a poll can't
    # pick up a previous session's code.
    if enable:
        cache.set(f"ac_captured_{ac.topic_key}", None)
    set_learn(ac.topic_key, enable, ttl=data.get('ttl', 30))
    return jsonify({"learn": bool(enable), "unit_id": unit_id})


@bp.route("/ac/<int:unit_id>/captured", methods=['GET'])
def ac_captured(unit_id):
    ac = ACUnit.query.filter_by(id=unit_id).first()
    if not ac:
        return jsonify({"error": "AC not found"}), 404
    raw = cache.get(f"ac_captured_{ac.topic_key}")
    if not raw:
        return jsonify(None)
    try:
        return jsonify(json.loads(raw))
    except (json.JSONDecodeError, TypeError):
        return jsonify(None)
