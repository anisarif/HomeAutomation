from flask import request, Blueprint, jsonify, make_response
from .models import db, UserHome
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt, create_refresh_token, unset_jwt_cookies
from werkzeug.security import check_password_hash, generate_password_hash
from . import limiter  # Import limiter from __init__.py

bp = Blueprint('auth', __name__, url_prefix='/auth')

def hash_password(password):
    return generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)

@bp.route("/login", methods=["POST"])
@limiter.limit("5 per minute")
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    error = None
    user = UserHome.query.filter_by(username=username).first()
    if user is None:
        error = 'Incorrect username.'
        return make_response(error, 401)
    elif not check_password_hash(user.password, password):
        error = 'Incorrect password.'
        return make_response(error, 401)

    if error is None:
        current_user = {"id": user.id, "username": user.username, "role": user.role}
        is_admin = user.role == "admin"
        access_token = create_access_token(identity=user.id, additional_claims={"is_administrator": is_admin, "current_user": current_user})
        refresh_token = create_refresh_token(identity=user.id, additional_claims={"is_administrator": is_admin, "current_user": current_user})
        return jsonify(access_token=access_token, refresh_token=refresh_token)
    
    return error

@bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    claims = get_jwt()
    is_admin = claims["is_administrator"]
    current_user = claims["current_user"]
    access_token = create_access_token(identity=identity, additional_claims={"is_administrator": is_admin, "current_user": current_user})
    return jsonify(access_token=access_token)

@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    resp = jsonify({'logout': True})
    unset_jwt_cookies(resp)
    return resp, 200
