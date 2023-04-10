import functools
from flask import Flask, request, flash, render_template, redirect, url_for, Blueprint, jsonify
from . import api
from .models import db, UserHome, Boards, Actuators
from werkzeug.security import generate_password_hash

bp = Blueprint('api', __name__, url_prefix='/api')

# ADD A USER 

@bp.route("/user/add", methods=['GET', 'POST'])
def adduser():
    if request.method == 'POST':
        username = request.args.get('username')
        password = request.args.get('password')
        role = request.args.get('role')
        user = UserHome(username=username, password=generate_password_hash(password), role=role)
        db.session.add(user)
        db.session.commit()
        flash("user added")
        return redirect(url_for('index'))

    return render_template('api/adduser.html')

# GET ALL USERS

@bp.route("/user/getall")
def getusers():
    users = UserHome.query.all()
    res = []
    for user in users:
        user = {
            "id": user.id,
            "username":user.username,
            "role":user.role,
        }
        res.append(user)
    return jsonify(res)

# GET USER BY ID

@bp.route("/user/get_id/")
def getuser_id(id):
    user = UserHome.query.filter_by(id=id).first()
    return jsonify({
        "id":user.id,
        "username":user.username,
        "role":user.role
    })

# GET USER BY USERNAME

@bp.route("/user/get_username/")
def getuser_username(username):
    user = UserHome.query.filter_by(username=username).first()

    if user is None:
        error = 'Incorrect username.'

    return jsonify({
        "id":user.id,
        "username":user.username,
        "password":user.password,
        "role":user.role
    })

# UPDATE A USER BY ID

@bp.route("/user/update/", methods=['PUT'])
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

@bp.route("/user/delete/", methods=['DELETE'])
def deleteuser(id):
    user = UserHome.query.filter_by(id=id).first()
    if user:
        db.session.delete(user)
        db.session.commit()    
    return str("user {user.username} deleted")


# ADD A BOARD

@bp.route("/board/add", methods=['GET', 'POST'])
def addboard():
    users = UserHome.query.all()
    if request.method == 'POST':
        name = request.form['name']
        privacy = request.form['privacy']
        user_auth = request.form['user_auth']
        board = Boards(name=name, privacy=privacy, user_auth=user_auth)
        db.session.add(board)
        db.session.commit()
        flash("board added")
        return redirect(url_for('index'))

    return render_template('api/addboard.html', users=users)

# GET ALL BOARDS

@bp.route("/board/getall")
def getboards():
    boards = Boards.query.all()
    return boards

# GET BOARD BY ID

@bp.route("/board/get/<int:id>")
def getboard(id):
    board = Boards.query.filter_by(id=id).first()
    return board

# UPDATE A BOARD BY ID

@bp.route("/board/update/<int:id>", methods=['PUT'])
def updateboard(id):
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

@bp.route("/actuator/add", methods=['GET', 'POST'])
def addactuator():
    boards = Boards.query.all()
    if request.method == 'POST':
        name = request.form['name']
        pin = request.form['pin']
        board_id = request.form['board_id']
        type = request.form['type']
        state = 0
        actuator = Actuators(name=name, pin=pin, board_id=board_id, type=type, state=state)
        db.session.add(actuator)
        db.session.commit()
        flash("actuator added")
        return redirect(url_for('index'))
    return render_template('api/addactuator.html', boards=boards)


# GET ALL ACTUATORS

@bp.route("/actuator/getall")
def getactuators():
    actuators = Actuators.query.all()
    return actuators

# GET ACTUATOR BY ID

@bp.route("/actuator/get/<int:id>")
def getactuator(id):
    actuator = Actuators.query.filter_by(id=id).first()
    return actuator

# UPDATE A ACTUATOR BY ID

@bp.route("/actuator/update/<int:id>", methods=['PUT'])
def updateactuator(id):
    return

# DELETE ACTUATOR BY ID 

@bp.route("/actuator/delete/<int:id>", methods=['DELETE'])
def deletactuator():
    actuator = Actuators.query.filter_by(id=id).first()
    if actuator:
        db.session.delete(actuator)
        db.session.commit()    
    return

