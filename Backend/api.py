from functools import wraps
from flask import request, Blueprint, jsonify, current_app
from .models import db, UserHome, Boards, Actuators, LockActions
from werkzeug.security import generate_password_hash
from flask_jwt_extended import get_jwt_identity, jwt_required
from .utils import Action
from .mqtt_client import mqtt, cache

bp = Blueprint('api', __name__, url_prefix='/api')


##################################            ##################################
##################################   USERS    ##################################
##################################            ##################################


# ADD A USER  


@bp.route("/user/add", methods=['POST'])
def adduser():
    data = request.get_json()

    username = data['username']
    password = data['password']
    role = data['role']
    user = UserHome(username=username,
                    password=generate_password_hash(password), role=role)
    db.session.add(user)
    db.session.commit()
    return 'user added'


# GET ALL USERS

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

# GET USER BY ID


@bp.route("/user/get_id")
def getuser_id(id):
    user = UserHome.query.filter_by(id=id).first()
    return jsonify({
        "id": user.id,
        "username": user.username,
        "role": user.role
    })

# GET USER BY USERNAME


@bp.route("/user/get_username")
def getuser_username(username):
    user = UserHome.query.filter_by(username=username).first()

    if user is None:
        error = 'Incorrect username.'

    return jsonify({
        "id": user.id,
        "username": user.username,
        "password": user.password,
        "role": user.role
    })

# UPDATE A USER BY ID


@bp.route("/user/update/<int:id>", methods=['PUT'])
def updateuser(id):
    user = UserHome.query.filter_by(id=id).first()
    if user:
        data = request.get_json()
        user.username = data['username']
        user.role = data['role']
        db.session.commit()
    return str("user {user.username} updated")

# DELETE USER BY ID


@bp.route("/user/delete", methods=['DELETE'])
def deleteuser():
    data = request.get_json()
    id = data['id']['id']
    user = UserHome.query.filter_by(id=id).first()
    if user:
        db.session.delete(user)
        db.session.commit()
    return "user " + str(id) + " deleted"


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


##################################            ##################################
##################################   BOARDS   ##################################
##################################            ##################################


# ADD A BOARD

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

# GET ALL BOARDS


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

# GET BOARD BY ID


@bp.route("/board/get")
def getboard(id):
    board = Boards.query.filter_by(id=id).first()
    return board

# UPDATE A BOARD BY ID


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
            board.users = data['users']
        db.session.commit()
    return str("board {board.name} updated")

# DELETE BOARD BY ID


@bp.route("/board/delete", methods=['DELETE'])
def deleteboard():
    data = request.get_json()
    id = data['id']['id']

    board = Boards.query.filter_by(id=id).first()
    if board:
        db.session.delete(board)
        db.session.commit()
    return "Board " + str(id) + " deleted"


##################################            ##################################
################################## ACTUATORS  ##################################
##################################            ##################################


# ADD AN ACTUATOR

@bp.route("/actuator/add", methods=['POST'])
def addactuator():
    data = request.get_json()

    name = data['name']
    pin = data['pin']
    board_id = data['board_id']
    type = data['type']
    state = 0
    actuator = Actuators(name=name, pin=int(pin), board_id=int(
        board_id), type=type, state=int(state))
    db.session.add(actuator)
    db.session.commit()
    return "actuator added"


# GET ALL ACTUATORS

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

# GET ACTUATOR BY ID


@bp.route("/actuator/get/<int:id>")
def getactuator(id):

    actuator = Actuators.query.filter_by(id=id).first()
    if actuator:
        actuator = {
            "id": actuator.id,
            "name": actuator.name,
            "pin": actuator.pin,
            "board_id": actuator.board_id,
            "type": actuator.type,
            "state": actuator.state,
        }
        return actuator


# UPDATE A ACTUATOR STATE BY ID

@bp.route("/actuator/update/<int:id>", methods=['PUT'])
@jwt_required()
def update_actuator(id):
    # Extracting the user_id from the JWT token
    user_id = get_jwt_identity()

    actuator = Actuators.query.filter_by(id=id).first()
    if actuator:
        state = request.get_json('state')
        print(state['state'])
        if state['state'] == False:
            actuator.state = 0
            db.session.commit()

            # create a new LockActions entry
            lock_action = LockActions(user_id=user_id,
                                      board_id=actuator.board_id,
                                      actuator_id=id,
                                      state=0)
            db.session.add(lock_action)
            db.session.commit()

            return "updated to false " + str(id)
        
        elif state['state'] == True:
            actuator.state = 1
            db.session.commit()

            # create a new LockActions entry
            lock_action = LockActions(user_id=user_id,
                                      board_id=actuator.board_id,
                                      actuator_id=id,
                                      state=1)
            db.session.add(lock_action)
            db.session.commit()

            return "updated to true " + str(id)
        
        return ("error while updating actuator state", 400) 

    else:
        return "actuator not found"
    
# DELETE ACTUATOR BY ID


@bp.route("/actuator/delete", methods=['DELETE'])
def deletactuator():
    data = request.get_json()
    id = data['id']['id']
    actuator = Actuators.query.filter_by(id=id).first()
    if actuator:
        db.session.delete(actuator)
        db.session.commit()
    return "actuator deleted"

# Action MQTT

@bp.route("/act/<int:id>", methods=['POST'])
def actionmqtt(id):
    Action(id)
    return "Action triggered for ID: " + str(id)

# Sensor Temperature humidity

@bp.route("/sensor/temp_hum/", methods=['GET'])
def sensor_temp_hum():
    temp = cache.get('room_temp')
    hum = cache.get('room_humidity')
    return jsonify({"temp": temp, "hum": hum})