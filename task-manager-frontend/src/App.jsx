import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import TaskDashboard from './components/TaskDashboard';
import PendingTasks from './components/PendingTasks';
import './App.css';

const CheckerRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user?.roles?.includes('ROLE_CHECKER')) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<TaskDashboard />} />
              <Route element={<CheckerRoute />}>
                <Route path="/pending" element={<PendingTasks />} />
              </Route>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
