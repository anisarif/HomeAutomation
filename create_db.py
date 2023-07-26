import psycopg2
from psycopg2 import sql

def create_database(dbname, user, password, host, new_user, new_password):
    conn = psycopg2.connect(dbname="postgres", user=user, password=password, host=host)
    conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()

    cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(dbname)))

    # Create a new superuser
    cursor.execute(sql.SQL("CREATE USER {} WITH SUPERUSER PASSWORD '{}'").format(
        sql.Identifier(new_user),
        sql.SQL(new_password)))

    # Grant all privileges on the new database to the new user
    cursor.execute(sql.SQL("GRANT ALL PRIVILEGES ON DATABASE {} TO {}").format(
        sql.Identifier(dbname),
        sql.Identifier(new_user)))

    cursor.close()
    conn.close()

# Replace these values with your actual PostgreSQL settings
user = "admin_db"
password = "password_db"
host = "localhost"

# This will be the name of the new database
dbname = "home_db"

# These will be the username and password of the new superuser
new_user = "home"
new_password = "admin"

create_database(dbname, user, password, host, new_user, new_password)