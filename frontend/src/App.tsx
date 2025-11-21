import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Permissions from './pages/Permissions';
import './App.css';
import { useAuth } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import RolePermissions from './pages/RolePermissions';
import RolesManagement from './pages/RolesManagement';


const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Router>

        <Routes>
          <Route path="/login" element={<Login />} />
       <Route
  path="/dashboard"
  element={
    <RequireAuth isAuthenticated={isAuthenticated}>
      <Dashboard />
    </RequireAuth>
  }
/>
          <Route path="/users"  element={
    <RequireAuth isAuthenticated={isAuthenticated}>
      <Users />
    </RequireAuth>
  } />
 <Route path="/roles/:id/permissions" element={<RolePermissions />} />
<Route path="/roles" element={
  <RequireAuth isAuthenticated={isAuthenticated}>
    <RolesManagement />
  </RequireAuth>
} />

<Route path="/permissions" element={
  <RequireAuth isAuthenticated={isAuthenticated}>
    <Permissions />
  </RequireAuth>
} />
         
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />

        </Routes>
 
    </Router>
  );
};

export default App;
