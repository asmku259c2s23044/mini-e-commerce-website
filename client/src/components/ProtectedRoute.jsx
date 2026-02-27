import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { userInfo } = useAuth();
    const location = useLocation();

    if (!userInfo) {
        // Redirect to login but save the current location to redirect back after login
        return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
    }

    if (adminOnly && userInfo.role !== 'admin') {
        // If it's an admin only route and user is not admin, redirect to home
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
