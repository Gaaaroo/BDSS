import React, { children, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingPage from '../components/LoadingPage';

const ProtectedRoute = ({ allowedRoles, role, loadingRole }) => {
  if (loadingRole) return <LoadingPage />;
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
