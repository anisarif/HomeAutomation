# test/behaviors/test_error_handling.py
class TestErrorHandlingBehaviors:
    @pytest.mark.parametrize("endpoint,method,data,expected_error", [
        ("/api/user/add", "post", {"username": ""}, "validation"),
        ("/api/board/get/999", "get", None, "not found"),
        ("/api/actuator/updateState/1", "put", {"state": "invalid"}, "validation")
    ])
    def test_error_responses(self, client, auth_headers, endpoint, method, data, expected_error):
        func = getattr(client, method)
        response = func(endpoint, 
                       json=data if data else None,
                       headers=auth_headers)
        
        assert response.status_code in [400, 404]
        error_response = response.get_json()
        assert "error" in error_response
        assert expected_error in error_response["error"].lower()