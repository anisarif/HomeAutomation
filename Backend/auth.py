from flask import Flask, request, flash, render_template, redirect, url_for, Blueprint
from . import api
from .models import db, UserHome

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/register/', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        role = 'admin'
        user = UserHome(username=username, password=password, role=role)
        db.session.add(user)
        db.session.commit()
        flash("admin added")
        return redirect(url_for('index'))

    return render_template('auth/register.html')


@bp.route('/login/', methods=['GET', 'POST'])
def login():
    return


@bp.route("/logout")
def logout():
    return
