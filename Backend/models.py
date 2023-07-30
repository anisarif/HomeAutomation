from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum
from datetime import datetime

db = SQLAlchemy()

user_auth = db.Table('user_auth',
                     db.Column('userhome_id', db.Integer, db.ForeignKey(
                         'user_home.id'), primary_key=True),
                     db.Column('boards_id', db.Integer, db.ForeignKey(
                         'boards.id'), primary_key=True)
                     )


class UserHome(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String)
    role = db.Column(Enum("admin", "user", name="role_type"),
                     default="user", nullable=False)
    """ admin or user """
    boards = db.relationship(
        'Boards', secondary=user_auth, backref=db.backref('users', lazy=True))


class Boards(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, unique=True, nullable=False)
    privacy = db.Column(Enum("private", "public", name="privacy_type"),
                        nullable=False)
    actuators = db.relationship(
        'Actuators', backref='board', cascade='all, delete-orphan')


class Actuators(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, unique=True, nullable=False)
    pin = db.Column(db.Integer, nullable=False)
    board_id = db.Column(db.Integer, db.ForeignKey(
        'boards.id'), nullable=False)
    type = db.Column(Enum("Light", "Lock", "Sensor",
                     name="actuator_type"), nullable=False)
    state = db.Column(db.Boolean, index=True, nullable=False, default=False)


class LockActions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    actuator_id = db.Column(db.Integer, nullable=False)
    board_id = db.Column(db.Integer, nullable=False ) 
    state = db.Column(db.Boolean, nullable=False)
    time = db.Column(db.DateTime, default=datetime.utcnow)
