import { SecurityUtils } from '../utils/security';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/';

export const ApiService = {
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },

    async request(endpoint, options = {}) {
        try {
            const token = SecurityUtils.getToken();
            const url = `${API_BASE_URL}${endpoint}`;
            
            const config = {
                ...options,
                headers: {
                    ...this.headers,
                    ...options.headers,
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            };

            if (config.body && typeof config.body === 'object') {
                config.body = JSON.stringify(config.body);
            }

            const response = await fetch(url, config);
            
            if (response.status === 401) {
                SecurityUtils.clearSecureData();
                window.location.href = '/login';
                return null;
            }

            const data = await response.json();
            return { data, status: response.status };

        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: data
        });
    },

    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data
        });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};