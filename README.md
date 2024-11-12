# HomeAutomation

This project is a home automation system built using Python Flask for the backend, React and TailwindCss for the frontend, HTTPS and MQTT for real-time communication. The system allows users to control various IoT devices in their home.

## Installation

### Hardware

- Raspberry Pi
- Esp8266
- Relays
- Sensor (Temperature and Humidity)

### Prerequisites

- Python 3.8+
- Node.js and npm
- PostgreSQL
- Arduino IDE
- Mosquitto MQTT Broker on Raspberry Pi

### Backend

1. Clone the repository: `git clone https://github.com/anisarif/HomeAutomation.git`
2. Navigate to the backend directory: `cd HomeAutomation/Backend`
3. Install the Python dependencies: `pip install -r requirements.txt`
4. Set up the database: `python create_db.py`
5. Run the backend: `python app_run.py`

### Frontend

1. Navigate to the frontend directory: `cd HomeAutomation/Frontend/react_frontend/`
2. Install the Node.js dependencies: `npm install`
3. Run the frontend: `npm start`

### Devices

1. Navigate to the devices directory: `cd HomeAutomation/Devices`
2. Connect the board to setup
3. Open the files in the Arduino IDE
4. Compile and Upload the sketch into the board

## Features

- Control IoT devices in real-time
- User authentication and authorization (Role Based Access Control)
- Real-time updates via MQTT
- Sensors data monitoring

## Testing

### Backend

To run the tests, navigate to the backend directory
Set up the database: `python create_test_db.py` and run `pytest`.

### Frontend

To run the tests, navigate to the frontend directory and run `npm test`

## Architecture Diagram

[Architecture Diagram.pdf](https://github.com/anisarif/HomeAutomation/files/12208517/Architecture.Diagram.pdf)

## Database Backup Script

1. Open the script ‘HomeAutomation/Backend/backup.sh’
2. Replace "your_password", "your_username", "localhost", "your_database", and "/path/to/backup/directory"
3. Make the script executable: `chmod +x backup.sh`
4. Test the script by running it: `./backup.sh`

### Set up a cron job to run the script at regular intervals

1. Open the crontab file with `crontab -e`
2. Add this to run the script every day at 3 AM: `0 3 * * * /path/to/your/backup/backup.sh`
3. Replace "/path/to/your/backup/script.sh" with the actual path to the backup.sh script

## Demo

https://soloprojecthomeautomation.netlify.app/
username : admin
password : admin

---

## List of Measures Implemented and Planned:

### On the Hardware Level: (Raspberry Pi)

- Changing all default users and passwords: Ensure all default credentials are changed to strong and unique passwords.
- Physically securing the Raspberry Pi with a case/lock: Use a secure case and physical locks to prevent unauthorized access.
- Blocking/desoldering unused Ports: Disable or physically block unused ports to prevent unauthorized access.
- Allowing only known USB devices to connect: Implement policies to allow only trusted USB devices.
- LUKS encryption of SD card: Encrypt the SD card using LUKS to protect data at rest.
- Anti-tamper mechanisms for USB access key: Use anti-tamper mechanisms to protect the USB key required for accessing the Raspberry Pi.

### On the Local Network Level: (Home Network)

- Enforcing HTTPS for all communications: Ensure all communications are encrypted using HTTPS.
- SSH using keys instead of passwords, possibly with 2FA: Use SSH keys for authentication and consider implementing two-factor authentication.
- Fail2ban to prevent multiple wrong login attempts: Use Fail2ban to block IP addresses after multiple failed login attempts.
- Honeypot SSH to detect and prevent unauthorized access: Implement honeypot SSH servers to detect and prevent unauthorized access attempts.

### On the Global Network Level:

- Unique tokens and device certificates for securing communication: Use unique tokens and device certificates to authenticate and secure communications.
- Signing Docker images: Sign Docker images to ensure integrity and authenticity.
- Monitoring system for anomalies and alerts: Implement monitoring systems to detect anomalies and send alerts for suspicious activities.

### Additional Security Measures Implemented

- JWT for Authentication and Authorization: Secure token-based authentication and role-based access control.
- Environment Variables for Secret Management: Storing sensitive information such as secret keys and database URLs in environment variables.
- Password Hashing: Using bcrypt for hashing and salting passwords.
- Input Validation: Using Marshmallow schemas to validate incoming data.
- Parameterized Queries: Using SQLAlchemy ORM to prevent SQL injection.
- Comprehensive Error Handling: Implementing error handling and logging for debugging and monitoring.
- Rate Limiting with Flask-Limiter: Preventing abuse by limiting the number of requests.
- Content Security Policy (CSP) with Flask-Talisman: Mitigating cross-site scripting (XSS) and other code injection attacks.
- Secure Headers with Flask-Talisman: Enforcing secure HTTP headers.
- Secure device registration and authentication.
- Enhance MQTT security.
- Add rate limiting for device communications.
- API key authentication.
- Better JWT configuration with CSRF protection and shorter token expiration times.
- Advanced logging with structured format and sensitive data filtering.
- Redis-based rate limiting.
- Enhanced CORS security with restrictive policies.
- Token validation and encryption in frontend code.
- Secure session management and user data sanitization in frontend code.