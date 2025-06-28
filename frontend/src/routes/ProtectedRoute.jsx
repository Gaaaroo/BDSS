import React, { children, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, role }) => {
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
