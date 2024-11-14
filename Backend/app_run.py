import os
from Backend import create_app

def run_flask_app():
    cert_path = os.getenv('SSL_CERT', '/app/Backend/certs/cert.pem')
    key_path = os.getenv('SSL_KEY', '/app/Backend/certs/priv_key.pem')
    
    app = create_app()
    app.run(
        host='0.0.0.0',
        debug=True,
        ssl_context=(cert_path, key_path)
    )

if __name__ == "__main__":
    run_flask_app()