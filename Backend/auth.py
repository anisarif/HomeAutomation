from flask import request, Blueprint, jsonify, make_response
from .models import db, UserHome
from flask_jwt_extended import create_access_token,jwt_required, get_jwt_identity, get_jwt, create_refresh_token, unset_jwt_cookies
from werkzeug.security import check_password_hash

bp = Blueprint('auth', __name__, url_prefix='/auth')


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
        refresh_token = create_refresh_token(identity=user.id, additional_claims={"is_administrator": is_admin, "current_user":current_user})
        return jsonify(access_token=access_token, refresh_token=refresh_token)

    return error

# Refresh JWT Token Route

@bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    claims = get_jwt()
    is_admin = claims["is_administrator"]
    current_user = claims["current_user"]
    access_token = create_access_token(identity=identity, additional_claims={"is_administrator": is_admin, "current_user":current_user})
    return jsonify(access_token=access_token)

# Logout Route

@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    resp = jsonify({'logout': True})
    unset_jwt_cookies(resp)
    return resp, 200

