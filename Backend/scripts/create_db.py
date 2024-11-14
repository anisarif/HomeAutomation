import os
import psycopg2
from psycopg2 import sql
import time

def wait_for_db(host, max_retries=5):
    retries = 0
    while retries < max_retries:
        try:
            conn = psycopg2.connect(
                dbname="postgres",
                user=os.getenv("POSTGRES_USER", "postgres"),
                password=os.getenv("POSTGRES_PASSWORD", "changeme"),
                host=host
            )
            conn.close()
            return True
        except psycopg2.OperationalError:
            retries += 1
            time.sleep(2)
    return False

def create_database():
    host = os.getenv("DB_HOST", "db")
    dbname = os.getenv("POSTGRES_DB", "homeautomation")
    user = os.getenv("POSTGRES_USER", "postgres")
    password = os.getenv("POSTGRES_PASSWORD", "changeme")
    app_user = os.getenv("APP_DB_USER", "home")
    app_password = os.getenv("APP_DB_PASSWORD", "admin")

    if not wait_for_db(host):
        raise Exception("Database is not available")

    try:
        conn = psycopg2.connect(
            dbname="postgres",
            user=user,
            password=password,
            host=host
        )
        conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (dbname,))
        if not cursor.fetchone():
            cursor.execute(sql.SQL("CREATE DATABASE {}").format(
                sql.Identifier(dbname)))

        # Check if user exists
        cursor.execute("SELECT 1 FROM pg_roles WHERE rolname = %s", (app_user,))
        if not cursor.fetchone():
            cursor.execute(sql.SQL(
                "CREATE USER {} WITH PASSWORD %s"
            ).format(sql.Identifier(app_user)), (app_password,))

        # Grant privileges
        cursor.execute(sql.SQL("GRANT ALL PRIVILEGES ON DATABASE {} TO {}").format(
            sql.Identifier(dbname),
            sql.Identifier(app_user)
        ))

        print(f"Database {dbname} and user {app_user} created successfully")

    except Exception as e:
        print(f"Error creating database: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    create_database()