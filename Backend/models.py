from flask import current_app as app
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class UserHome(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String)
    role = db.Column(db.String)
    """ admin user or guest """

class Rooms(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, unique=True, nullable=False)
    state = db.Column(db.String, nullable=False)     
    """ private or public """
    user_auth = db.Column(db.Integer)
    """ user.id of authorized users if 0 all users 'public', if 1 only admin access"""

class Hardwares(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pin = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String, unique=True, nullable=False)
    board = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String, nullable=False)
    """ light, locker .. different output switcher time """
    state = db.Column(db.Boolean)



