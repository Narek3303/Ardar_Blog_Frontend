// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { authToken, loading } = useAuth();
    const location = useLocation();

    // Սպասում ենք մինչև loading-ը ավարտվի
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500 text-lg">Բեռնում...</div>
            </div>
        );
    }

    // Միայն եթե loading=false և authToken չկա՝ տանում ենք login
    if (!authToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Հակառակ դեպքում՝ վերադարձնում ենք երեխաներին
    return children;
};

export default PrivateRoute;
