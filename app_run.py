import subprocess

#def start_venv():
    #subprocess.run(". venv/bin/activate", shell=True)

#def start_postgresql_server():
    #subprocess.run("sudo service postgresql start", shell=True)


def run_flask_app():
    subprocess.run("flask --app Backend run --host='0.0.0.0' --debug --cert='cert.pem'  --key='priv_key.pem' ", shell=True)

if __name__ == "__main__":
    #start_postgresql_server()
    run_flask_app()
