import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import ClubDetailsPage from './pages/ClubDetailsPage';
import AdminDashboard from './pages/AdminDashboard';
import ApplicationPage from './pages/ApplicationPage';
import MessagesPage from './pages/MessagesPage';
import './styles/main.css';

function App() {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Authentication page */}
        <Route path="/login" element={<AuthPage />} />

        {/* Protected Dashboard */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected Profile Dashboard */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />

        {/* Public Club Details Page */}
        <Route path="/clubs/:id" element={<ClubDetailsPage />} />

        {/* Public Volunteer Application Page */}
        <Route path="/apply" element={<ApplicationPage />} />

        {/* Protected Messages Page */}
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Super Admin Dashboard */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all Route redirects to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
