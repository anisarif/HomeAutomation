# test/behaviors/test_security_behaviors.py
class TestSecurityBehaviors:
    def test_jwt_token_lifecycle(self, client):
        # Login to get tokens
        response = client.post("/auth/login", 
                             json={"username": "admin", "password": "admin"})
        tokens = response.get_json()
        
        # Test token validation
        response = client.get("/api/user/getall", 
                            headers={"Authorization": f"Bearer {tokens['access_token']}"})
        assert response.status_code == 200
        
        # Test token expiration
        time.sleep(3600)  # Wait for token expiry
        response = client.get("/api/user/getall", 
                            headers={"Authorization": f"Bearer {tokens['access_token']}"})
        assert response.status_code == 401

    def test_rate_limiting(self, client):
        # Make multiple rapid requests
        for _ in range(51):  # Exceed rate limit of 50/hour
            client.post("/auth/login", 
                       json={"username": "admin", "password": "wrong"})
        
        response = client.post("/auth/login", 
                             json={"username": "admin", "password": "admin"})
        assert response.status_code == 429  # Too Many Requests