This project is a home automation system built using Flask for the backend, React for the frontend, and MQTT for real-time communication. The system allows users to control various IoT devices in their home.

## Installation

### Prerequisites

- Python 3.8+
- Node.js and npm
- PostgreSQL

### Backend

1. Clone the repository: `git clone https://github.com/anisarif/HomeAutomation.git`
2. Navigate to the backend directory: `cd HomeAutomation/Backend`
3. Install the Python dependencies: `pip install -r requirements.txt`
4. Set up the database: `python create_test_db.py`
5. Run the backend: `flask run`

### Frontend

1. Navigate to the frontend directory: `cd HomeAutomation/Frontend`
2. Install the Node.js dependencies: `npm install`
3. Run the frontend: `npm start`

## Features

- Control IoT devices in real-time
- User authentication and authorization
- Real-time updates via MQTT

## Testing

To run the tests, navigate to the backend directory and run `pytest`.