set -e

# Wait for database and run migrations
python scripts/create_db.py

# Start application
python app_run.py