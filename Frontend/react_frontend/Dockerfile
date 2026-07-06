# Frontend/react_frontend/Dockerfile
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend code
COPY . .

# Bake API/MQTT endpoints at build time (CRA inlines REACT_APP_* during build)
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_MQTT_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV REACT_APP_MQTT_URL=$REACT_APP_MQTT_URL

# Keep the production build light enough for a Raspberry Pi:
# GENERATE_SOURCEMAP=false skips sourcemaps (the biggest memory/time hog).
ENV GENERATE_SOURCEMAP=false

# Build the application
RUN npm run build

# Install serve to run the built application
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Command to serve the built application
CMD ["serve", "-s", "build", "-l", "3000"]
