# test/behaviors/test_database_behaviors.py
class TestDatabaseBehaviors:
    def test_transaction_rollback(self, client, auth_headers):
        # Test transaction rollback on error
        response = client.post("/api/board/add",
                             json={
                                 "name": "test_board",
                                 "privacy": "public"
                             },
                             headers=auth_headers)
        assert response.status_code == 200
        
        # Attempt to create duplicate board (should fail)
        response = client.post("/api/board/add",
                             json={
                                 "name": "test_board",
                                 "privacy": "public"
                             },
                             headers=auth_headers)
        assert response.status_code == 400
        
        # Verify only one board exists
        boards = client.get("/api/board/getall", headers=auth_headers).get_json()
        assert len(boards) == 1