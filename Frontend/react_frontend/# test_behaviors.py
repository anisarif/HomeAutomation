# test_behaviors.py
import pytest
from Backend.models import UserHome, Boards, Actuators

class TestUserBehaviors:
    """Test user-related behaviors"""
    
    def test_user_registration_flow(self, client, db_session):
        # Given a new user registration request
        user_data = {
            "username": "newuser",
            "password": "password123",
            "role": "user"
        }
        
        # When registering the user
        response = client.post("/api/user/add", json=user_data)
        
        # Then the user should be created successfully
        assert response.status_code == 200
        
        # And the user should exist in database
        user = UserHome.query.filter_by(username="newuser").first()
        assert user is not None
        assert user.role == "user"

    def test_user_authentication_flow(self, client):
        # Given an existing user
        login_data = {"username": "admin", "password": "admin"}
        
        # When logging in
        response = client.post("/auth/login", json=login_data)
        
        # Then authentication should succeed
        assert response.status_code == 200
        assert "access_token" in response.get_json()

class TestBoardBehaviors:
    """Test board-related behaviors"""
    
    def test_board_creation_and_management(self, client, auth_headers):
        # Given a board creation request
        board_data = {
            "name": "testboard",
            "privacy": "public"
        }
        
        # When creating the board
        response = client.post("/api/board/add", 
                             json=board_data, 
                             headers=auth_headers)
        
        # Then board should be created
        assert response.status_code == 200
        
        # When adding an actuator to the board
        actuator_data = {
            "name": "test_actuator",
            "board_id": 1,
            "pin": 1,
            "type": "Light",
            "state": False
        }
        response = client.post("/api/actuator/add", 
                             json=actuator_data, 
                             headers=auth_headers)
        
        # Then actuator should be added
        assert response.status_code == 200
        
        # And actuator should be retrievable
        response = client.get("/api/actuator/get/1", 
                            headers=auth_headers)
        assert response.status_code == 200
        assert response.get_json()["name"] == "test_actuator"

class TestActuatorBehaviors:
    """Test actuator-related behaviors"""
    
    def test_actuator_state_management(self, client, auth_headers, mock_mqtt):
        # Given an existing actuator
        board_data = {"name": "testboard", "privacy": "public"}
        client.post("/api/board/add", json=board_data, headers=auth_headers)
        
        actuator_data = {
            "name": "test_actuator",
            "board_id": 1,
            "pin": 1,
            "type": "Light",
            "state": False
        }
        client.post("/api/actuator/add", json=actuator_data, headers=auth_headers)
        
        # When changing actuator state
        response = client.put("/api/actuator/updateState/1", 
                            json={"state": True}, 
                            headers=auth_headers)
        
        # Then state should be updated
        assert response.status_code == 200
        
        # And MQTT message should be sent
        mock_mqtt.assert_called_once()