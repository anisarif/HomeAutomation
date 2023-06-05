# test_routes.py
from werkzeug.security import check_password_hash
from Backend.models import UserHome, Boards, Actuators  # import your UserHome, Boards and Actuators models

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
    assert response.data.decode() == '[{"id":1,"role":"admin","username":"admin"},{"id":2,"role":"user","username":"testuser"},{"id":3,"role":"admin","username":"testadmin"}]\n'
""" 
def test_getuser_id(client, app):
    
        # We'll add a user and an admin 
        client.post("api/user/add", json={"username": "testuser", "role":"user"})
        client.post("api/user/add", json={"username": "testadmin", "role":"admin"})
    
        # Now, we'll test the getusers functionality
        response = client.get("api/user/get_id", id=1)
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

def test_getboards(client):
    
        # We'll add a public and a private board 
        client.post("api/board/add", json={"name": "testboard", "privacy":"public"})
        client.post("api/board/add", json={"name": "testboard2", "privacy":"private", "users":["1"]})
    
        # Now, we'll test the getboards functionality
        response = client.get("api/board/getall")
        assert response.status_code == 200  # Checks the response status
    
        # Checks the response data
        assert response.data.decode() == '[{"id":1,"name":"testboard","privacy":"public"},{"id":2,"name":"testboard2","privacy":"private"}]\n'

def test_addactuator_Light(client, app):

    # We'll add a board
    client.post("api/board/add", json={"name": "testboard", "privacy":"public"})

    response = client.post(
        "api/actuator/add", 
        json={
            "name": "testactuator",
            "board_id": 1,
            "pin": 1,
            "type": "Light",
            "state": False,
        },
    )

    assert response.status_code == 200  # Checks the response status
    assert response.data.decode() == 'actuator added'  # Checks the response message

    # Verifies the actuator is added in database

    with app.app_context():
        actuator = Actuators.query.filter_by(name="testactuator").first()
        assert actuator is not None
        assert actuator.name == "testactuator"
        assert actuator.board_id == 1
        assert actuator.pin == 1
        assert actuator.type == "Light"
        assert actuator.state == False

def test_addactuator_Lock(client, app):
         
        # We'll add a board
        client.post("api/board/add", json={"name": "testboard", "privacy":"public"})
    
        response = client.post(
            "api/actuator/add", 
            json={
                "name": "testactuator",
                "board_id": 1,
                "pin": 1,
                "type": "Lock",
                "state": False,
            },
        )
    
        assert response.status_code == 200  # Checks the response status
        assert response.data.decode() == 'actuator added'  # Checks the response message
    
        # Verifies the actuator is added in database
    
        with app.app_context():
            actuator = Actuators.query.filter_by(name="testactuator").first()
            assert actuator is not None
            assert actuator.name == "testactuator"
            assert actuator.board_id == 1
            assert actuator.pin == 1
            assert actuator.type == "Lock"
            assert actuator.state == False

def test_getactuators(client):
        
        # We'll add a board
        client.post("api/board/add", json={"name": "testboard", "privacy":"public"})

        # We'll add a Light and a Lock actuator 
        client.post("api/actuator/add", json={"name": "testactuator", "board_id":1, "pin":1, "type":"Light", "state":False})
        client.post("api/actuator/add", json={"name": "testactuator2", "board_id":1, "pin":2, "type":"Lock", "state":False})
    
        # Now, we'll test the getactuators functionality
        response = client.get("api/actuator/getall")
        assert response.status_code == 200  # Checks the response status
    
        # Checks the response data
        assert response.data.decode() == '[{"board_id":1,"id":1,"name":"testactuator","pin":1,"state":false,"type":"Light"},{"board_id":1,"id":2,"name":"testactuator2","pin":2,"state":false,"type":"Lock"}]\n'