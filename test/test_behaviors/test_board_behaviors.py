# test/behaviors/test_board_behaviors.py
import pytest
from Backend.models import Boards, Actuators

class TestBoardBehaviors:
    """Test board management workflows"""
    
    def test_board_creation_and_access_flow(self, client, auth_headers):
        """Test complete board creation and access workflow"""
        # Given a new board creation request
        create_response = client.post("/api/board/add",
                                    json={
                                        "name": "living_room",
                                        "privacy": "private",
                                        "users": ["1"]
                                    },
                                    headers=auth_headers)
        assert create_response.status_code == 200
        
        # When accessing the board
        get_response = client.get("/api/board/get/1", 
                                headers=auth_headers)
        assert get_response.status_code == 200
        board_data = get_response.get_json()
        assert board_data["name"] == "living_room"
        
        # Then only authorized users can access it
        unauth_response = client.get("/api/board/get/1")
        assert unauth_response.status_code == 401

