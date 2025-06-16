import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const ProtectedRoute = ({ children }) => {
    const { user, loading, error } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingIndicator />;
    }

    if (error) {
        return <Navigate to="/login" state={{ from: location, error }} replace />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};
const LoadingIndicator = () => (
  <div style={{
    textAlign: 'center',
    padding: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#f99b10'
  }}>
    ⏳ Loading...
  </div>
);


export default ProtectedRoute;