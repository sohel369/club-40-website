import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--primary-color)',
        fontFamily: 'var(--font-bengali)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <i class="fa-solid fa-spinner fa-spin" style={{ fontSize: '3rem', marginBottom: '16px' }}></i>
          <h2>অপেক্ষা করুন / Please wait...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
