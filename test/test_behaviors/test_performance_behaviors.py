# test/behaviors/test_performance_behaviors.py
class TestPerformanceBehaviors:
    def test_concurrent_requests(self, client, auth_headers):
        start_time = time.time()
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [
                executor.submit(client.get, "/api/board/getall", headers=auth_headers)
                for _ in range(100)
            ]
            responses = [f.result() for f in futures]
        duration = time.time() - start_time
        
        assert duration < 5.0  # Should handle 100 requests in under 5 seconds
        assert all(r.status_code == 200 for r in responses)