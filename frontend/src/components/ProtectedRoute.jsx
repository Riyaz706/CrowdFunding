import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { authStore } from '../store/authStore';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { isAuthenticated, currentUser, loading } = authStore();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser?.role)) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
