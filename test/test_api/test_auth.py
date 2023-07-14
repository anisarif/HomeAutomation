# test_auth.py

from Backend.models import UserHome
from werkzeug.security import check_password_hash


def test_register(client, app):

    # Verify the default admin was added to the database
    with app.app_context():
        user = UserHome.query.filter_by(username="admin").first()
        assert user is not None
        assert user.username == "admin"
        assert check_password_hash(user.password, "admin")  # Check the password is hashed
        assert user.role == "admin"  # Verify user role is admin

def test_login(client):

    # test the login functionality
    response = client.post("/auth/login", json={"username": "admin", "password": "admin"})
    assert response.status_code == 200
    assert "access_token" in response.get_json()  # Checks if there is a token in the response
    assert "refresh_token" in response.get_json()
    # Test for wrong username
    response = client.post("/auth/login", json={"username": "wrong_user", "password": "admin"})
    assert response.status_code != 200  # Should not be successful
    assert response.data.decode() == 'Incorrect username.'  # Checks the response message

    # Test for wrong password
    response = client.post("/auth/login", json={"username": "admin", "password": "wrong_password"})
    assert response.status_code != 200  # Should not be successful
    assert response.data.decode() == 'incorrect password.'  # Checks the response message