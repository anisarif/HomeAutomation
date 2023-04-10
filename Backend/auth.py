from flask import Flask, request, flash, render_template, redirect, url_for, Blueprint, jsonify
from .models import db, UserHome
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash, generate_password_hash
from flask_cors import CORS, cross_origin

bp = Blueprint('auth', __name__, url_prefix='/auth')
CORS(bp)

# First connection Admin registration 

@bp.route('/register/', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.args.get('username')
        password = request.args.get('password')
        role = 'admin'
        user = UserHome(username=username, password=generate_password_hash(password), role=role)
        db.session.add(user)
        db.session.commit()
        flash("admin added")
        return redirect(url_for('index'))

    return render_template('auth/register.html')


# Login Route

@bp.route("/login", methods=["POST"])
@cross_origin()
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
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)

    return error

# Logout Route

@bp.route("/logout")
def logout():
    return
