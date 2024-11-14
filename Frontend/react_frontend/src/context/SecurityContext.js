// context/SecurityContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';

const SecurityContext = createContext(null);

export const SecurityProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const encryptToken = useCallback((token) => {
        return CryptoJS.AES.encrypt(
            token,
            process.env.REACT_APP_ENCRYPTION_KEY
        ).toString();
    }, []);

    const decryptToken = useCallback((encryptedToken) => {
        try {
            const bytes = CryptoJS.AES.decrypt(
                encryptedToken,
                process.env.REACT_APP_ENCRYPTION_KEY
            );
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error('Token decryption failed:', error);
            return null;
        }
    }, []);

    const validateToken = useCallback((token) => {
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }, []);

    const login = useCallback((token, userData) => {
        const encryptedToken = encryptToken(token);
        sessionStorage.setItem('token', encryptedToken);
        setUser(userData);
        setIsAuthenticated(true);
    }, [encryptToken]);

    const logout = useCallback(() => {
        sessionStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    const checkAuthStatus = useCallback(async () => {
        setLoading(true);
        try {
            const encryptedToken = sessionStorage.getItem('token');
            if (!encryptedToken) {
                logout();
                return;
            }

            const token = decryptToken(encryptedToken);
            if (!token || !validateToken(token)) {
                logout();
                return;
            }

            const decoded = jwtDecode(token);
            setUser(decoded);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Auth check failed:', error);
            logout();
        } finally {
            setLoading(false);
        }
    }, [decryptToken, validateToken, logout]);

    const value = {
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        checkAuthStatus,
        validateToken
    };

    return (
        <SecurityContext.Provider value={value}>
            {children}
        </SecurityContext.Provider>
    );
};

SecurityProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useSecurityContext = () => {
    const context = useContext(SecurityContext);
    if (!context) {
        throw new Error('useSecurityContext must be used within SecurityProvider');
    }
    return context;
};