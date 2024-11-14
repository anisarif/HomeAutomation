# Backend/app_run.py
import os
import subprocess

def run_flask_app():
    cert_path = os.path.join('certs', 'cert.pem')
    key_path = os.path.join('certs', 'priv_key.pem')
    
    command = f"flask --app Backend run --host='0.0.0.0' --debug --cert='{cert_path}' --key='{key_path}'"
    subprocess.run(command, shell=True)

if __name__ == "__main__":
    run_flask_app()