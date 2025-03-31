// src/components/admin/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';

const AdminRoutes: React.FC = () => {
  const { user } = useAuth();
  
  // Check if user is an admin
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;