from flask import request, Blueprint, jsonify
from .models import db, UserHome, Boards, Actuators, LockActions
from .utils import Action
from .mqtt_client import cache
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

@bp.route("/act/<int:id>", methods=['POST'])
def actionmqtt(id):
    Action(id)
    return f"Action triggered for ID: {id}"

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
