import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import injectContext from "./store/appContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useAuth } from "./hooks/useAuth";

// Security utility functions
const securityUtils = {
    validateToken: (token) => {
        if (!token) return false;
        try {
            // Decrypt token if it's encrypted
            const decryptedToken = sessionStorage.getItem("token") ? 
                CryptoJS.AES.decrypt(sessionStorage.getItem("token"), process.env.REACT_APP_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8) : 
                null;
            
            if (!decryptedToken) return false;
            
            const decoded = jwtDecode(decryptedToken);
            return decoded.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    },

    sanitizeParams: (params) => {
        return Object.keys(params).reduce((acc, key) => {
            acc[key] = typeof params[key] === 'string' ? 
                params[key].replace(/[<>]/g, '') : 
                params[key];
            return acc;
        }, {});
    }
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
        return <LoadingSpinner />;
    }
    
    return isAuthenticated ? children : <Navigate replace to="/login" />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
        return <LoadingSpinner />;
    }
    
    return isAuthenticated ? <Navigate replace to="/" /> : children;
};

const Layout = () => {
    const { checkAuthStatus, initializeAuth } = useAuth();
    
    useEffect(() => {
        initializeAuth();
        
        const authCheckInterval = setInterval(checkAuthStatus, 60000);
        
        let activityTimeout;
        const resetActivityTimer = () => {
            clearTimeout(activityTimeout);
            activityTimeout = setTimeout(() => {
                window.location.href = "/login";
            }, 30 * 60 * 1000);
        };

        window.addEventListener("mousemove", resetActivityTimer);
        window.addEventListener("keypress", resetActivityTimer);
        
        return () => {
            clearInterval(authCheckInterval);
            clearTimeout(activityTimeout);
            window.removeEventListener("mousemove", resetActivityTimer);
            window.removeEventListener("keypress", resetActivityTimer);
        };
    }, [initializeAuth, checkAuthStatus]);

    return (
        <ErrorBoundary>
            <Routes>
                <Route 
                    path="/login" 
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route 
                    path="/" 
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path="/user/profile/:id" 
                    element={
                        <ProtectedRoute>
                            <UserProfile />
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path="*" 
                    element={<Navigate replace to="/" />} 
                />
            </Routes>
        </ErrorBoundary>
    );
};

export default Layout;