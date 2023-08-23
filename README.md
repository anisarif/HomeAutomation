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
3. Replace  "/path/to/your/backup/script.sh"  with the actual path to the backup.sh script

## Demo

https://soloprojecthomeautomation.netlify.app/
username : admin
password : admin
