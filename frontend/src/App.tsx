import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SurveyList from './pages/surveys/SurveyList';
import SurveyBuilder from './pages/surveys/SurveyBuilder';
import SurveyResponse from './pages/surveys/SurveyResponse';
import Analytics from './pages/Analytics';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="surveys" element={<SurveyList />} />
            <Route path="surveys/new" element={<SurveyBuilder />} />
            <Route path="surveys/:id" element={<SurveyResponse />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;