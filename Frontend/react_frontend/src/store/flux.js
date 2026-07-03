const backendurl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/";

const getState = ({ getStore, getActions, setStore }) => {
    const request = async (endpoint, options = {}) => {
        const defaultHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        const response = await fetch(`${backendurl}${endpoint}`, {
            ...options,
            mode: 'cors',
            headers: { ...defaultHeaders, ...options.headers }
        });
        return response;
    };

    return {
        store: {
            users: null,
            deviceStates: {},
            weatherData: null,
            sensorData: null
        },
        actions: {
            addUser: async (username, role) => {
                const response = await request('api/user/add', {
                    method: 'POST',
                    body: JSON.stringify({ username, role })
                });
                if (!response.ok) throw new Error('Failed to add user');
                return response;
            },

            updateUser: async (id, username, role) => {
                const response = await request(`api/user/update/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ username, role })
                });
                if (!response.ok) throw new Error('Failed to update user');
                return true;
            },

            deleteUser: async (id) => {
                const response = await request(`api/user/delete/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete user');
                return response;
            },

            addBoard: async (name, privacy, users) => {
                const response = await request('api/board/add', {
                    method: 'POST',
                    body: JSON.stringify({ name, privacy, users })
                });
                if (!response.ok) throw new Error('Failed to add board');
                return response;
            },

            updateBoard: async (id, name, privacy, users) => {
                const response = await request(`api/board/update/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ name, privacy, users })
                });
                if (!response.ok) throw new Error('Failed to update board');
                return true;
            },

            deleteBoard: async (id) => {
                const response = await request(`api/board/delete/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete board');
                return response;
            },

            addActuator: async (name, pin, board_id, type) => {
                const response = await request('api/actuator/add', {
                    method: 'POST',
                    body: JSON.stringify({ name, pin, board_id, type })
                });
                if (!response.ok) throw new Error('Failed to add actuator');
                return true;
            },

            updateActuator: async (id, name, pin, board_id, type) => {
                const response = await request(`api/actuator/update/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ name, pin, board_id, type })
                });
                if (!response.ok) throw new Error('Failed to update actuator');
                return true;
            },

            deleteActuator: async (id) => {
                const response = await request(`api/actuator/delete/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete actuator');
                return true;
            },

            getActuatorById: async (lockId) => {
                const id = Object.values(lockId);
                const response = await request(`api/actuator/get/${id}`, { method: 'GET' });
                if (!response.ok) throw new Error('Failed to fetch actuator');
                return await response.json();
            },

            updateState: async ({ lockId, state }) => {
                const response = await request(`api/actuator/toggle/${lockId}`, {
                    method: 'POST',
                    body: JSON.stringify({ state })
                });
                if (!response.ok) throw new Error('Failed to toggle actuator');
                return true;
            },

            act: async ({ lockId, state }) => {
                const response = await request(`api/act/${lockId}`, {
                    method: 'POST',
                    body: JSON.stringify({ state })
                });
                if (!response.ok) throw new Error('Failed to execute action');
                return true;
            },

            getCurrentWeather: async () => {
                const response = await fetch(
                    "https://api.open-meteo.com/v1/forecast?" +
                    "latitude=36.845128&longitude=10.163944&" +
                    "current_weather=true&forecast_days=1&" +
                    "timezone=Europe%2FBerlin"
                );
                if (!response.ok) throw new Error('Failed to fetch weather data');
                return await response.json();
            },

            getRoomSensor: async () => {
                const response = await request("api/sensor/temp_hum/", { method: 'GET' });
                if (!response.ok) throw new Error('Failed to fetch room sensor data');
                return await response.json();
            },

            sendACState: async (unitId, state) => {
                const response = await request(`api/ac/${unitId}/state`, {
                    method: 'POST',
                    body: JSON.stringify(state)
                });
                if (!response.ok) throw new Error('Failed to set AC state');
                return await response.json();
            },

            sendACCommand: async (unitId, commandId) => {
                const response = await request(`api/ac/${unitId}/send/${commandId}`, {
                    method: 'POST'
                });
                if (!response.ok) throw new Error('Failed to send AC command');
                return true;
            },

            startLearn: async (unitId, ttl = 30) => {
                const response = await request(`api/ac/${unitId}/learn`, {
                    method: 'POST',
                    body: JSON.stringify({ enable: true, ttl })
                });
                if (!response.ok) throw new Error('Failed to start learn mode');
                return true;
            },

            stopLearn: async (unitId) => {
                const response = await request(`api/ac/${unitId}/learn`, {
                    method: 'POST',
                    body: JSON.stringify({ enable: false })
                });
                if (!response.ok) throw new Error('Failed to stop learn mode');
                return true;
            },

            saveCapturedCommand: async (unitId, name, payload) => {
                const protocol = (payload && payload.protocol) ? payload.protocol : 'RAW';
                const response = await request(`api/ac/${unitId}/commands`, {
                    method: 'POST',
                    body: JSON.stringify({ name, payload, protocol })
                });
                if (!response.ok) throw new Error('Failed to save captured command');
                return await response.json();
            },

            deleteACCommand: async (commandId) => {
                const response = await request(`api/ac/commands/${commandId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete AC command');
                return true;
            },

            getHistory: async () => {
                try {
                    const response = await request("api/getHistory", { method: 'GET' });
                    if (!response.ok) return [];
                    return await response.json();
                } catch {
                    return [];
                }
            }
        }
    };
};

export default getState;
