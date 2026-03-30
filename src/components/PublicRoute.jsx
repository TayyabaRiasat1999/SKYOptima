import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from "../context/AuthContext"; 

export default function PublicRoute({ children }) {
    const { session } = UserAuth();

    // If a session exists, the user is already logged in.
    // Redirect them to the dashboard immediately.
    if (session) {
        return <Navigate to="/dashboard" replace />;
    }

    // If no session exists, render the requested page (SignIn or Register)
    return children;
}