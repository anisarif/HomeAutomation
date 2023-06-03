# test_auth.py

from Backend.models import UserHome
from werkzeug.security import check_password_hash


def test_register(client, app):
    # Assuming this is a first user registration, role will be "admin"
    response = client.post("/auth/register", json={"username": "test_admin", "password": "test_admin"})
    assert response.status_code == 200
    assert response.data.decode() == 'Admin {username} registred'  # Checks the response message

    # Verify the user was added to the database
    with app.app_context():
        user = UserHome.query.filter_by(username="test_admin").first()
        assert user is not None
        assert user.username == "test_admin"
        assert check_password_hash(user.password, "test_admin")  # Check the password is hashed
        assert user.role == "admin"  # Verify user role is admin

def test_login(client):
    # We'll register a user first
    client.post("/auth/register", json={"username": "test_user", "password": "test_user"})

    # Now, we'll test the login functionality
    response = client.post("/auth/login", json={"username": "test_user", "password": "test_user"})
    assert response.status_code == 200
    assert "access_token" in response.get_json()  # Checks if there is a token in the response

    # Test for wrong username
    response = client.post("/auth/login", json={"username": "wrong_user", "password": "test_user"})
    assert response.status_code != 200  # Should not be successful
    assert response.data.decode() == 'Incorrect username.'  # Checks the response message

    # Test for wrong password
    response = client.post("/auth/login", json={"username": "test_user", "password": "wrong_password"})
    assert response.status_code != 200  # Should not be successful
    assert response.data.decode() == 'incorrect password.'  # Checks the response message