# test_routes.py
import pytest
from werkzeug.security import check_password_hash
from Backend.models import UserHome, Boards  # import your UserHome, Boards models

def test_adduser(client, app):
    response = client.post(
        "api/user/add", 
        json={
            "username": "testuser",
            "role": "user",
        },
    )

    assert response.status_code == 200  # Checks the response status
    assert response.data.decode() == 'user added'  # Checks the response message

    # Verifies the user is added in database

    with app.app_context():
        user = UserHome.query.filter_by(username="testuser").first()
        assert user is not None
        assert user.username == "testuser"
        assert check_password_hash(user.password, "testuser")  # Checks the password is hashed
        assert user.role == "user"  

def test_getusers(client):

    # We'll add a user and an admin 
    client.post("api/user/add", json={"username": "testuser", "role":"user"})
    client.post("api/user/add", json={"username": "testadmin", "role":"admin"})

    # Now, we'll test the getusers functionality
    response = client.get("api/user/getall")
    assert response.status_code == 200  # Checks the response status

    # Checks the response data
    assert response.data.decode() == '[{"id":1,"role":"user","username":"testuser"},{"id":2,"role":"admin","username":"testadmin"}]\n'

""" 
def test_getuser_id(client, app):
    
        # We'll add a user and an admin 
        client.post("api/user/add", json={"username": "testuser", "role":"user"})
        client.post("api/user/add", json={"username": "testadmin", "role":"admin"})
    
        # Now, we'll test the getusers functionality
        response = client.get("api/user/get_id", json={"id":'1'})
        assert response.status_code == 200  # Checks the response status
    
        # Checks the response data
        assert response.data.decode() == '{"id":1,"role":"user","username":"testuser"}\n' 

def test_user_update(client, app):
    
        # We'll add a user and an admin 
        client.post("api/user/add", json={"username": "testuser", "role":"user"})
        client.post("api/user/add", json={"username": "testadmin", "role":"admin"})
    
        # Now, we'll test the updateuser functionality
        response = client.put("api/user/update", json={"id":'1', "username": "testuser2", "role":"admin"})
        assert response.status_code == 200  # Checks the response status
    
        # Checks the response data
        assert response.data.decode() == 'user updated\n' 
"""

def test_addboard_public(client, app):

    # We'll add a user  
    client.post("api/user/add", json={"username": "testuser", "role":"user"})

    response = client.post(
        "api/board/add", 
        json={
            "name": "testboard",
            "privacy": "public",
        },
    )

    assert response.status_code == 200  # Checks the response status
    assert response.data.decode() == 'board added'  # Checks the response message

    # Verifies the board is added in database

    with app.app_context():
        board = Boards.query.filter_by(name="testboard").first()
        assert board is not None
        assert board.name == "testboard"
        assert board.privacy == "public"

def test_addboard_private(client, app):
    response = client.post(
        "api/board/add", 
        json={"name":"testboard","privacy":"private","users":["1"]}
    )

    assert response.status_code == 200  # Checks the response status
    assert response.data.decode() == 'board added'  # Checks the response message

    # Verifies the board is added in database

    with app.app_context():
        board = Boards.query.filter_by(name="testboard").first()
        assert board is not None
        assert board.name == "testboard"
        assert board.privacy == "private"
