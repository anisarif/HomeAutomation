import os

from flask import Flask, render_template
import psycopg2
from flask_sqlalchemy import SQLAlchemy


def create_app(test_config=None):
    db = SQLAlchemy()
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config["SECRET_KEY"] = 'dev'
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://home:admin@localhost:5432/home_db"
    
    
    db.init_app(app)
    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    class UserHome(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String, unique=True, nullable=False)

    with app.app_context():
        db.create_all()
    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'
    
    @app.route('/query')
    def query():
        
        users = UserHome.query.all()
        return render_template('db.html', users=users)

    return app