import pytest
from Backend.models import UserHome
from Backend.api import UserSchema

class TestUserAPI:
    """Test suite for User API endpoints"""
    
    @pytest.fixture
    def valid_user_data(self):
        return {
            "username": "testuser",
            "password": "password123",
            "role": "user"
        }

    def test_user_schema_validation(self, valid_user_data):
        """Test UserSchema validation behavior"""
        schema = UserSchema()
        
        # Test valid data
        result = schema.load(valid_user_data)
        assert result["username"] == valid_user_data["username"]
        
        # Test invalid username
        with pytest.raises(ValidationError):
            schema.load({**valid_user_data, "username": ""})
            
        # Test invalid password
        with pytest.raises(ValidationError):
            schema.load({**valid_user_data, "password": "short"})
            
        # Test invalid role
        with pytest.raises(ValidationError):
            schema.load({**valid_user_data, "role": "invalid"})

    def test_add_user_endpoint(self, client, auth_headers, valid_user_data):
        """Test user creation behavior"""
        # Test successful creation
        response = client.post("/api/user/add", 
                             json=valid_user_data,
                             headers=auth_headers)
        assert response.status_code == 200
        assert response.data.decode() == "user added"
        
        # Verify user exists in database
        user = UserHome.query.filter_by(username=valid_user_data["username"]).first()
        assert user is not None
        assert user.role == valid_user_data["role"]

    def test_add_user_authorization(self, client, valid_user_data):
        """Test authorization behavior"""
        # Test without auth header
        response = client.post("/api/user/add", json=valid_user_data)
        assert response.status_code == 401
        
        # Test with non-admin user
        non_admin_headers = create_user_token("user")
        response = client.post("/api/user/add", 
                             json=valid_user_data,
                             headers=non_admin_headers)
        assert response.status_code == 403

    @pytest.mark.parametrize("invalid_data,expected_error", [
        ({"username": "", "password": "valid", "role": "user"}, "username"),
        ({"username": "valid", "password": "short", "role": "user"}, "password"),
        ({"username": "valid", "password": "valid", "role": "invalid"}, "role"),
    ])
    def test_add_user_validation_errors(self, client, auth_headers, invalid_data, expected_error):
        """Test input validation behavior"""
        response = client.post("/api/user/add", 
                             json=invalid_data,
                             headers=auth_headers)
        assert response.status_code == 400
        assert expected_error in response.get_json()