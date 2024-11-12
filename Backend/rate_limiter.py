from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import redis

class DeviceRateLimiter:
    def __init__(self, app):
        self.redis_client = redis.Redis(host='localhost', port=6379, db=0)
        self.limiter = Limiter(
            app,
            key_func=get_remote_address,
            default_limits=["200 per day", "50 per hour"]
        )

    def can_device_publish(self, device_id):
        """Rate limit device messages"""
        key = f"device_rate:{device_id}"
        current = self.redis_client.incr(key)
        
        # First message sets expiry
        if current == 1:
            self.redis_client.expire(key, 3600)  # 1 hour window
            
        return current <= 100  # 100 messages per hour per device