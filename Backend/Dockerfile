# Backend/Dockerfile
FROM python:3.8-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt
RUN pip install python-dotenv

COPY . /app/Backend/
COPY scripts/docker-entrypoint.sh /app/Backend/scripts/
RUN chmod +x /app/Backend/scripts/docker-entrypoint.sh


ENV PYTHONPATH=/app
ENV FLASK_APP=Backend
ENV FLASK_ENV=development
WORKDIR /app/Backend
ENTRYPOINT ["/app/Backend/scripts/docker-entrypoint.sh"]