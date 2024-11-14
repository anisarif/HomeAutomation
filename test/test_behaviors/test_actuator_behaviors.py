
# test/behaviors/test_actuator_behaviors.py
class TestActuatorBehaviors:
    """Test actuator control workflows"""
    
    def test_actuator_control_flow(self, client, auth_headers, mock_mqtt):
        """Test complete actuator control workflow"""
        # Given a board with an actuator
        client.post("/api/board/add",
                   json={"name": "bedroom", "privacy": "public"},
                   headers=auth_headers)
        
        client.post("/api/actuator/add",
                   json={
                       "name": "main_light",
                       "board_id": 1,
                       "pin": 1,
                       "type": "Light",
                       "state": False
                   },
                   headers=auth_headers)
        
        # When controlling the actuator
        control_response = client.put("/api/actuator/updateState/1",
                                    json={"state": True},
                                    headers=auth_headers)
        assert control_response.status_code == 200
        
        # Then MQTT message should be sent
        mock_mqtt.publish.assert_called_once_with("1", "1")
        
        # And state should be updated in database
        get_response = client.get("/api/actuator/get/1",
                                headers=auth_headers)
        assert get_response.get_json()["state"] == True