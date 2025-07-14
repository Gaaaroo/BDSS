import { Navigate } from 'react-router-dom';

export default function DashboardRedirect({ role }) {
  if (role === 'STAFF') return <Navigate to="/dashboard/staff-home" replace />;
  if (role === 'ADMIN') return <Navigate to="/dashboard/admin-home" replace />;
  return <div>Unauthorized</div>; // fallback nếu role không hợp lệ
}
