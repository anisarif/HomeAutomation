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
    role = db.Column(Enum("admin", "user", name="role_type"), default="user", nullable=False)
    """ admin or user """
    boards = db.relationship(
        'Boards', secondary=user_auth, backref=db.backref('users', lazy=True))


class Boards(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, unique=True, nullable=False)
    privacy = db.Column(Enum("private", "public", name="privacy_type"),
                        default="public", nullable=False)
    """ private or public """


class Actuators(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, unique=True, nullable=False)
    pin = db.Column(db.Integer, nullable=False)
    board_id = db.Column(db.Integer, db.ForeignKey(
        'boards.id'), nullable=False)
    board = db.relationship(
        'Boards', backref=db.backref('actuators', lazy=True))
    type = db.Column(Enum("Light", "Lock", "Sensor", name="actuator_type" ), nullable=False)
    """ light, locker .. different output switcher time """
    state = db.Column(db.Boolean)


class LockActions(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user_home.id'), nullable=False)
    user = db.relationship(
        'UserHome', backref=db.backref('user_actions', lazy=True))
    board_id = db.Column(db.Integer, db.ForeignKey(
        'boards.id'), nullable=False)
    board = db.relationship(
        'Boards', backref=db.backref('board_actions', lazy=True))
    actuator_id = db.Column(db.Integer, db.ForeignKey(
        'actuators.id'), index=True, nullable=False)
    actuator = db.relationship(
        'Actuators', backref=db.backref('actuator_actions', lazy=True))
    state = db.Column(db.Boolean, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
