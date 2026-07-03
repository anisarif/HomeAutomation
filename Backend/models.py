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
    type = db.Column(Enum("Light", "Lock", "Sensor", "RGBLight",
                     name="actuator_type"), nullable=False)
    state = db.Column(db.Boolean, index=True, nullable=False, default=False)


class LockActions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    actuator_id = db.Column(db.Integer, nullable=False)
    board_id = db.Column(db.Integer, nullable=False )
    state = db.Column(db.Boolean, nullable=False)
    time = db.Column(db.DateTime, default=datetime.utcnow)


class ACUnit(db.Model):
    """An air conditioner controlled over IR by a dedicated ESP8266.

    Two control mechanisms coexist:
      - protocol-based state (power/mode/temp/fan) when `protocol` is recognised
        (e.g. "COOLIX"), and
      - learned raw IR codes stored as `IRCommand` rows (universal fallback).
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, unique=True, nullable=False)
    # MQTT identity the firmware hardcodes, e.g. "ac_controller". Topics are
    # ac/<topic_key>/send | /learn | /captured.
    topic_key = db.Column(db.String, nullable=False)
    # Optional grouping/authorization only; the AC does not need a Boards row.
    board_id = db.Column(db.Integer, db.ForeignKey('boards.id'), nullable=True)
    # Protocol reported by the ESP decoder at learn time. None/"UNKNOWN" -> raw only.
    protocol = db.Column(db.String, nullable=True)
    # Desired protocol state (only meaningful when protocol is recognised).
    power = db.Column(db.Boolean, nullable=False, default=False)
    mode = db.Column(db.String, nullable=False, default="cool")
    """ cool | heat | dry | fan | auto """
    temp = db.Column(db.Integer, nullable=False, default=22)
    fan = db.Column(db.String, nullable=False, default="auto")
    """ auto | low | med | high """
    commands = db.relationship(
        'IRCommand', backref='ac', cascade='all, delete-orphan')


class IRCommand(db.Model):
    """A single learned/replayable IR code belonging to an ACUnit."""
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ac_id = db.Column(db.Integer, db.ForeignKey('ac_unit.id'), nullable=False)
    name = db.Column(db.String, nullable=False)
    """ e.g. "Power", "Temp+", "Cool 22" """
    protocol = db.Column(db.String, nullable=False, default="RAW")
    # JSON string: raw µs array for RAW, or value+bits for a recognised protocol.
    payload = db.Column(db.Text, nullable=False)
    category = db.Column(db.String, nullable=True)
