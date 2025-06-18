import React, { useEffect } from 'react';
import { Navigate, useNavigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, role }) => {
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
