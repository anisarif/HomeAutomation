from flask import request, Blueprint, jsonify, make_response
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
        return make_response(error, 401)
    
    elif not check_password_hash(user.password, password):
        error = 'incorrect password.'
        return make_response(error, 401)

    if error is None:
        current_user = {
                "id" : user.id,
                "username" : user.username,
                "role" : user.role,
            }
        if user.role == "admin":
            is_admin = True
        else:
            is_admin = False
            
        access_token = create_access_token(identity=user.id, additional_claims={"is_administrator": is_admin, "current_user":current_user})
        return jsonify(access_token=access_token)

    return error

