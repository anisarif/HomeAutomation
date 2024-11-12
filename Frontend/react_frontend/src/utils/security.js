import CryptoJS from "crypto-js";
// Used environment variables for sensitive configuration
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://www.soloproject.pro:5000/";
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || crypto.getRandomValues(new Uint8Array(32)).join('');

// Security utility functions
const SecurityUtils = {
    // Generate random nonce for additional security
    generateNonce: () => {
        return crypto.getRandomValues(new Uint8Array(16)).join('');
    },

    // Encrypt data with AES
    encrypt: (data) => {
        const nonce = SecurityUtils.generateNonce();
        const encrypted = CryptoJS.AES.encrypt(
            JSON.stringify({ data, nonce, timestamp: Date.now() }), 
            ENCRYPTION_KEY
        ).toString();
        return encrypted;
    },

    // Decrypt data and validate nonce/timestamp
    decrypt: (encryptedData) => {
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
            const { data, nonce, timestamp } = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
            
            // Validate timestamp (tokens older than 12 hours are invalid)
            if (Date.now() - timestamp > 12 * 60 * 60 * 1000) {
                throw new Error('Token expired');
            }
            
            return data;
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }
};

// HTTP request utility with security headers and error handling
const secureRequest = async (url, options = {}) => {
    const defaultHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Content-Type-Options': 'nosniff',
    };

    const config = {
        ...options,
        mode: 'cors',
        credentials: 'include',
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(BACKEND_URL + url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        
        return await response.text();
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
};

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            users: null,
            token: null,
            isAuthenticated: false,
            lastActivity: Date.now(),
        },
        actions: {
            // Auto logout after inactivity
            checkActivity: () => {
                const store = getStore();
                const INACTIVE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
                
                if (store.isAuthenticated && Date.now() - store.lastActivity > INACTIVE_TIMEOUT) {
                    getActions().logout();
                }
            },

            // Update last activity timestamp
            updateActivity: () => {
                setStore({ lastActivity: Date.now() });
            },

            login: async (username, password) => {
                try {
                    const response = await secureRequest('auth/login', {
                        method: 'POST',
                        body: JSON.stringify({ username, password }),
                    });

                    if (response.access_token && response.refresh_token) {
                        // Encrypt tokens before storage
                        sessionStorage.setItem("token", SecurityUtils.encrypt(response.access_token));
                        sessionStorage.setItem("refresh_token", SecurityUtils.encrypt(response.refresh_token));
                        
                        setStore({ 
                            token: response.access_token,
                            isAuthenticated: true,
                            lastActivity: Date.now()
                        });
                        
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Login failed:', error);
                    return false;
                }
            },

            logout: async () => {
                try {
                    const store = getStore();
                    if (store.token) {
                        await secureRequest('auth/logout', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${store.token}`
                            }
                        });
                    }
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    // Clear all sensitive data
                    sessionStorage.clear();
                    setStore({
                        token: null,
                        users: null,
                        isAuthenticated: false
                    });
                }
            },

            refreshToken: async () => {
                try {
                    const encryptedRefreshToken = sessionStorage.getItem("refresh_token");
                    if (!encryptedRefreshToken) {
                        throw new Error('No refresh token available');
                    }

                    const refreshToken = SecurityUtils.decrypt(encryptedRefreshToken);
                    if (!refreshToken) {
                        throw new Error('Invalid refresh token');
                    }

                    const response = await secureRequest('auth/refresh', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${refreshToken}`
                        }
                    });

                    if (response.access_token) {
                        sessionStorage.setItem("token", SecurityUtils.encrypt(response.access_token));
                        setStore({ 
                            token: response.access_token,
                            lastActivity: Date.now()
                        });
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Token refresh failed:', error);
                    getActions().logout();
                    return false;
                }
            },

            // Secure data fetching with automatic token refresh
            secureGet: async (endpoint) => {
                try {
                    const store = getStore();
                    const response = await secureRequest(endpoint, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${store.token}`
                        }
                    });
                    getActions().updateActivity();
                    return response;
                } catch (error) {
                    if (error.message.includes('401')) {
                        const refreshed = await getActions().refreshToken();
                        if (refreshed) {
                            return await getActions().secureGet(endpoint);
                        }
                    }
                    throw error;
                }
            },

            // Secure data posting with automatic token refresh
            securePost: async (endpoint, data) => {
                try {
                    const store = getStore();
                    const response = await secureRequest(endpoint, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${store.token}`
                        },
                        body: JSON.stringify(data)
                    });
                    getActions().updateActivity();
                    return response;
                } catch (error) {
                    if (error.message.includes('401')) {
                        const refreshed = await getActions().refreshToken();
                        if (refreshed) {
                            return await getActions().securePost(endpoint, data);
                        }
                    }
                    throw error;
                }
            },

            // Example of a secured API call
            getUsers: async () => {
                try {
                    const users = await getActions().secureGet('api/user/getall');
                    if (users) {
                        const encryptedUsers = SecurityUtils.encrypt(JSON.stringify(users));
                        sessionStorage.setItem("users", encryptedUsers);
                        setStore({ users });
                    }
                    return users;
                } catch (error) {
                    console.error('Failed to fetch users:', error);
                    throw error;
                }
            },
        }
    };
};

// Set up activity monitoring
if (typeof window !== 'undefined') {
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
        window.addEventListener(event, () => {
            const actions = getState({}).actions;
            actions.updateActivity();
        });
    });

    // Periodic activity check
    setInterval(() => {
        const actions = getState({}).actions;
        actions.checkActivity();
    }, 60000); // Check every minute
}

export default getState;