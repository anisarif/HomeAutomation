#!/bin/bash
set -e

echo "Starting database initialization..."
python /app/Backend/scripts/create_db.py

echo "Starting Flask application..."
python /app/Backend/app_run.py