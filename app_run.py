import os
import subprocess

def start_venv():
    subprocess.run(". venv/bin/activate", shell=True)

def start_postgresql_server():
    subprocess.run("sudo service postgresql start", shell=True)

def set_flask_app():
    os.environ["FLASK_APP"] = "Backend"

def run_flask_app():
    subprocess.run("flask run", shell=True)

if __name__ == "__main__":
    start_postgresql_server()
    set_flask_app()
    run_flask_app()
