from functools import wraps
from flask import request, Blueprint, jsonify, current_app
from .models import db, UserHome, Boards, Actuators
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, verify_jwt_in_request, get_jwt

bp = Blueprint('api', __name__, url_prefix='/api')

# ADD A USER


@bp.route("/user/add", methods=['POST'])
def adduser():
    data = request.get_json()

    username = data['username']
    password = data['username']
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


@bp.route("/user/update", methods=['PUT'])
def updateuser(id):
    user = UserHome.query.filter_by(id=id).first()
    if user:
        data = request.get_json()
        user.username = data['username']
        user.password = data['password']
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
    return "user {user.username} deleted"


# ADD A BOARD

@bp.route("/board/add", methods=['POST'])
def addboard():
    data = request.get_json()

    name = data['name']
    privacy = data['privacy']
    board = Boards(name=name, privacy=privacy)
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


@bp.route("/board/update", methods=['PUT'])
def updateboard(id):
    board = Boards.query.filter_by(id=id).first()
    if board:

        return

# DELETE BOARD BY ID


@bp.route("/board/delete/<int:id>", methods=['DELETE'])
def deletboard():
    board = Boards.query.filter_by(id=id).first()
    if board:
        db.session.delete(board)
        db.session.commit()
    return


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


@bp.route("/actuator/get")
def getactuator(id):
    actuator = Actuators.query.filter_by(id=id).first()
    if actuator:

        return actuator

# UPDATE A ACTUATOR BY ID


@bp.route("/actuator/update", methods=['PUT'])
def updateactuator(id):
    actuator = Actuators.query.filter_by(id=id).first()
    if actuator:
        name = request.form['name']
        pin = request.form['pin']
        board_id = request.form['board_id']
        type = request.form['type']
        state = 0
        actuator = Actuators(name=name, pin=pin,
                             board_id=board_id, type=type, state=state)
        db.session.add(actuator)
        db.session.commit()
        return "actuator added"


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
