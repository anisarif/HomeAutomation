// Frontend/react_frontend/src/store/flux.js
import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";

const backendurl = process.env.REACT_APP_BACKEND_URL || "https://www.soloproject.pro:5000/";
const API_VERSION = "v1";

const getState = ({ getStore, getActions, setStore }) => {
    // Use a more secure key generation method
    const secretKey = process.env.REACT_APP_ENCRYPTION_KEY || CryptoJS.lib.WordArray.random(256/8).toString();
    
    // Security utility functions
    const securityUtils = {
        validateToken: (token) => {
            try {
                const decoded = jwtDecode(token);
                return decoded.exp * 1000 > Date.now();
            } catch {
                return false;
            }
        },
        
        encryptData: (data) => {
            return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
        },
        
        decryptData: (encryptedData) => {
            try {
                const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
                return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            } catch {
                return null;
            }
        },
        
        sanitizeInput: (input) => {
            if (typeof input === 'string') {
                return input.replace(/[<>{}]/g, '');
            }
            return input;
        }
    };

    // HTTP request wrapper with security headers
    const secureRequest = async (endpoint, options = {}) => {
        const store = getStore();
        const defaultHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-API-Version': API_VERSION,
            'X-CSRF-Token': sessionStorage.getItem('csrf_token')
        };

        if (store.token) {
            defaultHeaders['Authorization'] = `Bearer ${store.token}`;
        }

        const requestOptions = {
            ...options,
            mode: 'cors',
            headers: {
                ...defaultHeaders,
                ...options.headers
            },
            credentials: 'include'
        };

        try {
            const response = await fetch(`${backendurl}${endpoint}`, requestOptions);
            
            if (response.status === 401) {
                const refreshed = await getActions().refreshToken();
                if (refreshed) {
                    requestOptions.headers['Authorization'] = `Bearer ${getStore().token}`;
                    return fetch(`${backendurl}${endpoint}`, requestOptions);
                }
            }
            
            return response;
        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    };

    return {
        store: {
            users: null,
            token: null,
            lastActivity: Date.now(),
            sessionTimeout: 30 * 60 * 1000, // 30 minutes
            deviceStates: {}, // Store device states
            weatherData: null,
            sensorData: null
        },
        actions: {
            // Authentication Actions
            login: async (username, password) => {
                try {
                    const sanitizedUsername = securityUtils.sanitizeInput(username);
                    
                    const response = await secureRequest('auth/login', {
                        method: 'POST',
                        body: JSON.stringify({
                            username: sanitizedUsername,
                            password
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Authentication failed');
                    }

                    const data = await response.json();

                    if (!securityUtils.validateToken(data.access_token)) {
                        throw new Error('Invalid token received');
                    }

                    const encryptedAccessToken = securityUtils.encryptData(data.access_token);
                    const encryptedRefreshToken = securityUtils.encryptData(data.refresh_token);

                    sessionStorage.setItem("token", encryptedAccessToken);
                    sessionStorage.setItem("refresh_token", encryptedRefreshToken);

                    setStore({ 
                        token: data.access_token,
                        lastActivity: Date.now()
                    });

                    return true;
                } catch (error) {
                    console.error('Login failed:', error);
                    throw error;
                }
            },

            logout: async () => {
                try {
                    await secureRequest('auth/logout', { method: 'POST' });
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    sessionStorage.clear();
                    setStore({ 
                        token: null,
                        users: null,
                        lastActivity: null,
                        deviceStates: {},
                        weatherData: null,
                        sensorData: null
                    });
                }
            },

            // Token Management
            refreshToken: async () => {
                try {
                    const encryptedRefreshToken = sessionStorage.getItem("refresh_token");
                    if (!encryptedRefreshToken) {
                        throw new Error('No refresh token available');
                    }

                    const decryptedRefreshToken = securityUtils.decryptData(encryptedRefreshToken);
                    if (!decryptedRefreshToken) {
                        throw new Error('Invalid refresh token');
                    }

                    const response = await secureRequest('auth/refresh', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${decryptedRefreshToken}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Token refresh failed');
                    }

                    const data = await response.json();
                    
                    if (!securityUtils.validateToken(data.access_token)) {
                        throw new Error('Invalid token received during refresh');
                    }

                    const encryptedNewToken = securityUtils.encryptData(data.access_token);
                    sessionStorage.setItem("token", encryptedNewToken);
                    setStore({ 
                        token: data.access_token,
                        lastActivity: Date.now()
                    });

                    return true;
                } catch (error) {
                    console.error('Token refresh failed:', error);
                    getActions().logout();
                    return false;
                }
            },

            // Session Management
            checkSession: () => {
                const store = getStore();
                if (store.token && Date.now() - store.lastActivity > store.sessionTimeout) {
                    getActions().logout();
                    return false;
                }
                setStore({ lastActivity: Date.now() });
                return true;
            },

            // User Management Actions
            addUser: async (username, password, role) => {
                try {
                    const sanitizedUsername = securityUtils.sanitizeInput(username);
                    const sanitizedRole = securityUtils.sanitizeInput(role);

                    const response = await secureRequest('api/user/add', {
                        method: 'POST',
                        body: JSON.stringify({
                            username: sanitizedUsername,
                            password,
                            role: sanitizedRole
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to add user');
                    }

                    return response;
                } catch (error) {
                    console.error('Add user failed:', error);
                    throw error;
                }
            },

            updateUser: async (id, username, role) => {
                try {
                    const sanitizedUsername = securityUtils.sanitizeInput(username);
                    const sanitizedRole = securityUtils.sanitizeInput(role);

                    const response = await secureRequest(`api/user/update/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            username: sanitizedUsername,
                            role: sanitizedRole
                        })
                    });

                    if (!response.ok) {
                        if (response.status === 401) {
                            await getActions().refreshToken();
                            return false;
                        }
                        throw new Error('Failed to update user');
                    }

                    return true;
                } catch (error) {
                    console.error('Update user failed:', error);
                    throw error;
                }
            },

            deleteUser: async (id) => {
                try {
                    const response = await secureRequest(`api/user/delete/${id}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete user');
                    }

                    return response;
                } catch (error) {
                    console.error('Delete user failed:', error);
                    throw error;
                }
            },

            // Board Management Actions
            addBoard: async (name, privacy, users) => {
                try {
                    const sanitizedName = securityUtils.sanitizeInput(name);
                    const sanitizedPrivacy = securityUtils.sanitizeInput(privacy);
                    const sanitizedUsers = users.map(user => securityUtils.sanitizeInput(user));

                    const response = await secureRequest('api/board/add', {
                        method: 'POST',
                        body: JSON.stringify({
                            name: sanitizedName,
                            privacy: sanitizedPrivacy,
                            users: sanitizedUsers
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to add board');
                    }

                    return response;
                } catch (error) {
                    console.error('Add board failed:', error);
                    throw error;
                }
            },

            updateBoard: async (id, name, privacy, users) => {
                try {
                    const sanitizedName = securityUtils.sanitizeInput(name);
                    const sanitizedPrivacy = securityUtils.sanitizeInput(privacy);
                    const sanitizedUsers = users.map(user => securityUtils.sanitizeInput(user));

                    const response = await secureRequest(`api/board/update/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            name: sanitizedName,
                            privacy: sanitizedPrivacy,
                            users: sanitizedUsers
                        })
                    });

                    if (!response.ok) {
                        if (response.status === 401) {
                            await getActions().refreshToken();
                            return false;
                        }
                        throw new Error('Failed to update board');
                    }

                    return true;
                } catch (error) {
                    console.error('Update board failed:', error);
                    throw error;
                }
            },

            deleteBoard: async (id) => {
                try {
                    const response = await secureRequest(`api/board/delete/${id}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete board');
                    }

                    return response;
                } catch (error) {
                    console.error('Delete board failed:', error);
                    throw error;
                }
            },

// Actuator Management Actions
addActuator: async (name, pin, board_id, type) => {
    try {
        const sanitizedName = securityUtils.sanitizeInput(name);
        const sanitizedPin = securityUtils.sanitizeInput(pin);
        const sanitizedType = securityUtils.sanitizeInput(type);

        const response = await secureRequest('api/actuator/add', {
            method: 'POST',
            body: JSON.stringify({
                name: sanitizedName,
                pin: sanitizedPin,
                board_id,
                type: sanitizedType
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add actuator');
        }

        console.log("Actuator added successfully");
        return await response.json();
    } catch (error) {
        console.error('Error adding actuator:', error);
        throw error;
    }
},

updateActuator: async (id, name, pin, board_id, type) => {
    try {
        const sanitizedName = securityUtils.sanitizeInput(name);
        const sanitizedPin = securityUtils.sanitizeInput(pin);
        const sanitizedType = securityUtils.sanitizeInput(type);

        const response = await secureRequest(`api/actuator/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: sanitizedName,
                pin: sanitizedPin,
                board_id,
                type: sanitizedType
            })
        });

        if (response.status === 401) {
            await getActions().refreshToken();
            return false;
        }

        if (!response.ok) {
            throw new Error('Failed to update actuator');
        }

        console.log(`Actuator ${id} updated successfully`);
        return true;
    } catch (error) {
        console.error('Error updating actuator:', error);
        throw error;
    }
},

deleteActuator: async (id) => {
    try {
        const response = await secureRequest(`api/actuator/delete/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete actuator');
        }

        console.log(`Actuator ${id} deleted successfully`);
        return true;
    } catch (error) {
        console.error('Error deleting actuator:', error);
        throw error;
    }
},

getActuatorById: async (lockId) => {
    try {
        const id = Object.values(lockId);
        const response = await secureRequest(`api/actuator/get/${id}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch actuator');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching actuator:', error);
        throw error;
    }
},

updateState: async ({ lockId, state }) => {
    try {
        const response = await secureRequest(`api/actuator/updateState/${lockId}`, {
            method: 'PUT',
            body: JSON.stringify({ state })
        });

        if (response.status === 401) {
            await getActions().refreshToken();
            return false;
        }

        if (!response.ok) {
            throw new Error('Failed to update state');
        }

        const actionResult = await getActions().act({ lockId, state });
        if (!actionResult) {
            throw new Error('Failed to execute actuator action');
        }

        console.log("State update and action completed successfully");
        return true;
    } catch (error) {
        console.error('Error updating state:', error);
        throw error;
    }
},

// IoT Action Execution
act: async ({ lockId, state }) => {
    try {
        const response = await secureRequest(`api/act/${lockId}`, {
            method: 'POST',
            body: JSON.stringify({ state })
        });

        if (!response.ok) {
            throw new Error('Failed to execute action');
        }

        return true;
    } catch (error) {
        console.error('Error executing action:', error);
        return false;
    }
},

// Weather and Sensor Actions
getCurrentWeather: async () => {
    try {
        const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?" +
            "latitude=36.845128&longitude=10.163944&" +
            "current_weather=true&forecast_days=1&" +
            "timezone=Europe%2FBerlin"
        );

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
},

getRoomSensor: async () => {
    try {
        const response = await secureRequest("api/sensor/temp_hum/", {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch room sensor data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching room sensor data:', error);
        throw error;
    }
},

// Session Management Actions
startActivityMonitor: () => {
    const store = getStore();
    const checkInterval = setInterval(() => {
        if (Date.now() - store.lastActivity > store.sessionTimeout) {
            getActions().logout();
            clearInterval(checkInterval);
        }
    }, 60000); // Check every minute

    window.addEventListener('mousemove', () => {
        setStore({ lastActivity: Date.now() });
    });

    return () => {
        clearInterval(checkInterval);
        window.removeEventListener('mousemove', () => {});
    };
},

updateLastActivity: () => {
    setStore({ lastActivity: Date.now() });
}
}
};
};

export default getState;