# test_routes.py
import pytest
from werkzeug.security import generate_password_hash
from ...Backend import app, db  # import your Flask application instance and your database instance
from ...Backend.models import UserHome  # import your UserHome model

@pytest.fixture
def client():
    app.config['TESTING'] = True

    # If you are using a separate test database
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://home:admin@localhost:5432/test_home_db'

    with app.test_client() as client:
        # Setup: create the database tables
        with app.app_context():
            db.create_all()
        yield client
        # Teardown: drop the database tables
        with app.app_context():
            db.session.remove()
            db.drop_all()

def test_adduser(client):
    response = client.post(
        "/user/add", 
        json={
            "username": "testuser",
            "password": "testpassword",
            "role": "testrole"
        },
    )
    assert response.data.decode() == 'user added'  # Checks the response message

    # Verifies the user is added in database
    with app.app_context():
        user = UserHome.query.filter_by(username="testuser").first()
        assert user is not None
        assert user.username == "testuser"
        assert user.password == generate_password_hash("testpassword")  # Assuming you're hashing passwords
        assert user.role == "testrole"