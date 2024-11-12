from secrets import token_hex
from werkzeug.security import generate_password_hash, check_password_hash
from .models import db, Boards
from flask_jwt_extended import create_access_token
import hashlib
import hmac
import time

class DeviceSecurity:
    def __init__(self):
        self.TOKEN_EXPIRY = 3600  # 1 hour

    def generate_device_credentials(self):
        """Generate unique device ID and secret"""
        device_id = token_hex(16)  # 32-character hex string
        device_secret = token_hex(32)  # 64-character hex string
        return device_id, device_secret

    def register_device(self, name, device_type):
        """Register a new device with secure credentials"""
        device_id, device_secret = self.generate_device_credentials()
        
        new_device = Boards(
            id=device_id,
            name=name,
            type=device_type,
            secret_hash=generate_password_hash(device_secret),
            last_seen=None,
            is_active=True
        )
        
        db.session.add(new_device)
        db.session.commit()
        
        return {
            "device_id": device_id,
            "device_secret": device_secret  # Share this once with the device during setup
        }

    def verify_device(self, device_id, device_secret):
        """Verify device credentials"""
        device = Boards.query.filter_by(id=device_id).first()
        if not device or not device.is_active:
            return False
        
        return check_password_hash(device.secret_hash, device_secret)

    def generate_device_token(self, device_id):
        """Generate a short-lived JWT for device authentication"""
        return create_access_token(
            identity=device_id,
            additional_claims={"type": "device"},
            expires_delta=timedelta(seconds=self.TOKEN_EXPIRY)
        )

    def generate_message_signature(self, device_secret, message, timestamp):
        """Generate HMAC signature for device messages"""
        key = device_secret.encode('utf-8')
        msg = f"{message}{timestamp}".encode('utf-8')
        return hmac.new(key, msg, hashlib.sha256).hexdigest()