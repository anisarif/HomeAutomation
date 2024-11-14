import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import injectContext from "./store/appContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SecurityProvider } from "./context/SecurityContext";
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
    const { checkAuth, initializeAuth } = useAuth();
    
    useEffect(() => {
        // Initialize authentication state
        initializeAuth();
        
        // Set up authentication check interval
        const authCheckInterval = setInterval(checkAuth, 60000); // Check every minute
        
        // Set up activity monitoring
        let activityTimeout;
        const resetActivityTimer = () => {
            clearTimeout(activityTimeout);
            activityTimeout = setTimeout(() => {
                // Logout user after 30 minutes of inactivity
                window.location.href = "/login";
            }, 30 * 60 * 1000);
        };

        window.addEventListener("mousemove", resetActivityTimer);
        window.addEventListener("keypress", resetActivityTimer);
        
        // Cleanup function
        return () => {
            clearInterval(authCheckInterval);
            clearTimeout(activityTimeout);
            window.removeEventListener("mousemove", resetActivityTimer);
            window.removeEventListener("keypress", resetActivityTimer);
        };
    }, []);

    return (
        <ErrorBoundary>
            <SecurityProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route 
                            path="/login" 
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />

                        {/* Protected Routes */}
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

                        {/* Catch all route - redirect to home */}
                        <Route 
                            path="*" 
                            element={<Navigate replace to="/" />} 
                        />
                    </Routes>
                </BrowserRouter>
            </SecurityProvider>
        </ErrorBoundary>
    );
};

// Higher Order Component with Context
export default injectContext(Layout);