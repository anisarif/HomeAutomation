from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


user_auth = db.Table('user_auth',
    db.Column('userhome_id', db.Integer, db.ForeignKey('user_home.id'), primary_key=True),
    db.Column('boards_id', db.Integer, db.ForeignKey('boards.id'), primary_key=True)
)

class UserHome(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String)
    role = db.Column(db.String)
    """ admin user or guest """
    boards = db.relationship('Boards', secondary=user_auth, backref=db.backref('boards', lazy=True))

class Boards(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, unique=True, nullable=False)
    privacy = db.Column(db.String, nullable=False)     
    """ private or public """

class Actuators(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, unique=True, nullable=False)
    pin = db.Column(db.Integer, nullable=False)
    board_id = db.Column(db.Integer, db.ForeignKey('board.id'), nullable=False)
    board = db.relationship('Boards', backref=db.backref('board_id', lazy=True) )
    type = db.Column(db.String, nullable=False)
    """ light, locker .. different output switcher time """
    state = db.Column(db.Boolean)


    



