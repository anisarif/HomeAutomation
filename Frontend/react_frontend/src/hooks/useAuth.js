// hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecurityContext } from '../context/SecurityContext';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { 
        isAuthenticated,
        loading: securityLoading,
        user,
        login: securityLogin,
        logout: securityLogout,
        checkAuthStatus
    } = useSecurityContext();

    const login = useCallback(async (username, password) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const userData = jwtDecode(data.access_token);
            
            securityLogin(data.access_token, userData);
            navigate('/');
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }, [navigate, securityLogin]);

    const logout = useCallback(() => {
        securityLogout();
        navigate('/login');
    }, [navigate, securityLogout]);

    const initializeAuth = useCallback(async () => {
        await checkAuthStatus();
    }, [checkAuthStatus]);

    useEffect(() => {
        setIsLoading(securityLoading);
    }, [securityLoading]);

    return {
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        initializeAuth,
        checkAuthStatus
    };
};