from flask_sqlalchemy import SQLAlchemy
from flask import Flask



app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://home:admin@localhost:5432/home_db"
db = SQLAlchemy(app)
@app.route('/')
def hello():
    return {"hello": "world"}

if __name__ == '__main__':
    app.run(debug=True)