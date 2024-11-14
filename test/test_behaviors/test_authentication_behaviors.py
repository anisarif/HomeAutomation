# test/behaviors/test_user_behaviors.py
import pytest
from Backend.models import UserHome, Boards, Actuators

class TestUserBehaviors:
    """Test user-related workflows and behaviors"""
    
    def test_user_registration_and_login_flow(self, client, app):
        # Given a new user registration
        registration = client.post("/api/user/add",
                                 json={
                                     "username": "newuser",
                                     "password": "password123",
                                     "role": "user"
                                 },
                                 headers=auth_headers)
        assert registration.status_code == 200
        
        # When the user attempts to login
        login = client.post("/auth/login",
                           json={
                               "username": "newuser",
                               "password": "password123"
                           })
        assert login.status_code == 200
        
        # Then they should receive valid tokens
        tokens = login.get_json()
        assert "access_token" in tokens
        assert "refresh_token" in tokens

    def test_user_permission_management_flow(self, client, app):
        # Given an existing user
        client.post("/api/user/add",
                   json={
                       "username": "testuser",
                       "password": "password123",
                       "role": "user"
                   },
                   headers=auth_headers)
        
        # When updating their role
        update = client.put("/api/user/update/1",
                           json={"role": "admin"},
                           headers=auth_headers)
        assert update.status_code == 200
        
        # Then their permissions should be updated
        with app.app_context():
            user = UserHome.query.filter_by(username="testuser").first()
            assert user.role == "admin"