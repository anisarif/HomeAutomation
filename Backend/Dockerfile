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

COPY . .
RUN chmod +x scripts/docker-entrypoint.sh

ENV PYTHONPATH=/app

ENTRYPOINT ["./scripts/docker-entrypoint.sh"]