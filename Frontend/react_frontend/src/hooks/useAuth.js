// hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecurityContext } from '../context/SecurityContext';

export const useAuth = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const security = useSecurityContext();
    
    if (!security) {
        throw new Error('useAuth must be used within SecurityProvider');
    }

    const { 
        isAuthenticated,
        loading: securityLoading,
        user,
        login: securityLogin,
        logout: securityLogout,
        checkAuthStatus
    } = security;

    useEffect(() => {
        setIsLoading(securityLoading);
    }, [securityLoading]);

    const login = useCallback(async (username, password) => {
        try {
            const success = await securityLogin(username, password);
            if (success) {
                navigate('/');
            }
            return success;
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