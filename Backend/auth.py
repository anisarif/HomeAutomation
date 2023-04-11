from flask import request, Blueprint, jsonify
from .models import db, UserHome
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash, generate_password_hash

bp = Blueprint('auth', __name__, url_prefix='/auth')

# First connection Admin registration 

@bp.route('/register', methods=["POST"])
def register():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    role = 'admin'
    error = None
    user = UserHome(username=username, password=generate_password_hash(password), role=role)
    db.session.add(user)
    db.session.commit()
    if error is None:
        username = {"username":user.username}
        return "Admin {username} registred"
    return error


# Login Route

@bp.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    error=None
    user = UserHome.query.filter_by(username=username).first()
    if user is None:
        error = 'Incorrect username.'
    
    elif not check_password_hash(user.password, password):
        error = 'incorrect password.'

    if error is None:
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token)

    return error

# Logout Route

@bp.route("/logout")
def logout():
    return
