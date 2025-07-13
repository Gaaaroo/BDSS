import React from 'react';
import Home from '../pages/Landing';
import NotFound from '../pages/NotFound';
import { Route, Routes } from 'react-router';
import Login from '../pages/Login';
import Register from '../pages/Register';
import BloodCompatibility from '../pages/BloodCompatibility';
import WidgetChat from '../components/WidgetChat';
import ReplyWidgetChat from '../components/ReplyWidgetChat';
import Donor from '../pages/Donor';
import Seeker from '../pages/Seeker';
import MyActivity from '../pages/MyActivity';
import Profile from '../pages/Profile';
import Forum from '../pages/Forum';
import OTP from '../pages/OTP';
import MyPosts from '../pages/MyPosts';
import Blog from '../pages/Blog';
import RequestManagement from '../pages/RequestManagement';
import DashboardAdmin from '../pages/DashboardAdmin';
import Whole from '../pages/Whole';
import MemberManagement from '../pages/MemberManagement';
import ProtectedRoute from './ProtectedRoute';
import { useApp } from '../Contexts/AppContext';
import BlogManagement from '../pages/BlogManagement';
import ReceiveDetail from '../components/ReceiveDetail';
import DonationDetail from '../components/DonationDetail';
import Components from '../pages/Components';
import LayoutStaffAdmin from '../Layouts/LayoutStaffAdmin';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import DashboardStaff from '../pages/DashboardStaff';
import DashboardRedirect from '../components/DashboardRedirect';

export default function AppRoutes() {
  const { role } = useApp();
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<OTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/chat" element={<WidgetChat />} />
      <Route path="/rep" element={<ReplyWidgetChat />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/forum/my-posts" element={<MyPosts />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blood-compatibility" element={<BloodCompatibility />} />
      <Route path="*" element={<NotFound />} />

      <Route path="/dashboard" element={<LayoutStaffAdmin />}>
        {/* Redirect theo role (chỉ định route con khác nhau) */}
        <Route index element={<DashboardRedirect role={role} />} />

        {/* Staff */}
        <Route
          element={<ProtectedRoute allowedRoles={['STAFF']} role={role} />}
        >
          <Route path="staff-home" element={<DashboardStaff />} />
          <Route path="request-management" element={<RequestManagement />} />
          <Route path="inventory/whole" element={<Whole />} />
          <Route path="inventory/components" element={<Components />} />
          <Route path="blog-management" element={<BlogManagement />} />
        </Route>

        {/* Admin */}
        <Route
          element={<ProtectedRoute allowedRoles={['ADMIN']} role={role} />}
        >
          <Route path="admin-home" element={<DashboardAdmin />} />
          <Route path="member-management" element={<MemberManagement />} />
        </Route>
      </Route>

      {/* Member */}
      <Route element={<ProtectedRoute allowedRoles={['MEMBER']} role={role} />}>
        <Route path="/become-a-donor" element={<Donor />} />
        <Route path="/become-a-seeker" element={<Seeker />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-activity" element={<MyActivity />} />
        <Route
          path="/my-activity/donation-detail/:id"
          element={<DonationDetail />}
        />
        <Route
          path="/my-activity/receive-detail/:id"
          element={<ReceiveDetail />}
        />
      </Route>
    </Routes>
  );
}
