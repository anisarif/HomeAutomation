import React, { useState, useEffect, useContext, useCallback, memo } from "react";
import { Context } from "../store/appContext";
import { jwtDecode } from "jwt-decode";
import AdminPanel from "../components/AdminPanel/AdminPanel";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard/Dashboard";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useNavigate } from "react-router-dom";

// Security utilities
const securityUtils = {
    decodeAndValidateToken: (token) => {
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                throw new Error('Token expired');
            }
            return decoded;
        } catch (error) {
            console.error('Token validation error:', error);
            return null;
        }
    },

    sanitizeUserData: (userData) => {
        if (!userData) return null;
        return {
            ...userData,
            name: userData.name?.replace(/[<>]/g, ''),
            role: userData.role?.replace(/[<>]/g, '')
        };
    }
};

// Memoized components for performance
const MemoizedAdminPanel = memo(AdminPanel);
const MemoizedDashboard = memo(Dashboard);

const Home = () => {
    const { store, actions } = useContext(Context);
    const [isAdminView, setIsAdminView] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Handle view toggle with debounce
    const handleToggle = useCallback(() => {
        setToggle(prev => !prev);
    }, []);

    // Session validation and user data processing
    const validateSession = useCallback(async () => {
        try {
            setIsLoading(true);
            if (!store.token) {
                throw new Error('No token found');
            }

            const decodedToken = securityUtils.decodeAndValidateToken(store.token);
            if (!decodedToken) {
                throw new Error('Invalid token');
            }

            const sanitizedUser = securityUtils.sanitizeUserData({
                current: decodedToken.current_user,
                isAdmin: decodedToken.is_administrator
            });

            if (!sanitizedUser) {
                throw new Error('Invalid user data');
            }

            setUserData(sanitizedUser);
            setIsAdminView(sanitizedUser.isAdmin);

            // Store user data securely
            sessionStorage.setItem("current_User", JSON.stringify(sanitizedUser.current));

            // Refresh token if needed
            if (decodedToken.exp * 1000 - Date.now() < 300000) { // 5 minutes
                await actions.refreshToken();
            }

        } catch (error) {
            console.error('Session validation error:', error);
            sessionStorage.clear();
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    }, [store.token, actions, navigate]);

    // Initialize and monitor session
    useEffect(() => {
        validateSession();

        // Set up session monitoring
        const sessionCheck = setInterval(validateSession, 60000); // Check every minute

        // Activity monitoring
        let inactivityTimer;
        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                sessionStorage.clear();
                navigate('/login');
            }, 30 * 60 * 1000); // 30 minutes
        };

        window.addEventListener('mousemove', resetInactivityTimer);
        window.addEventListener('keypress', resetInactivityTimer);

        // Cleanup
        return () => {
            clearInterval(sessionCheck);
            clearTimeout(inactivityTimer);
            window.removeEventListener('mousemove', resetInactivityTimer);
            window.removeEventListener('keypress', resetInactivityTimer);
        };
    }, [validateSession, navigate]);

    // Error handling for data fetching
    const handleError = useCallback((error) => {
        console.error('Data fetching error:', error);
        // Implement error notification system here
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-600">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="bg-slate-600 h-full min-h-screen pb-20">
                <Navbar 
                    handleClick={handleToggle} 
                    isAdminView={isAdminView}
                    userData={userData}
                />
                {toggle ? (
                    <MemoizedAdminPanel onError={handleError} />
                ) : (
                    <MemoizedDashboard onError={handleError} />
                )}
            </div>
        </ErrorBoundary>
    );
};

export default memo(Home);