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
import Dashboard from '../pages/Dashboard';
import Inventory from '../pages/Inventory';
import MemberManagement from '../pages/MemberManagement';
import ProtectedRoute from './ProtectedRoute';
import { useApp } from '../Contexts/AppContext';
import BlogManagement from '../pages/BlogManagement';
import ReceiveDetail from '../components/ReceiveDetail';
import DonationDetail from '../components/DonationDetail';

export default function AppRoutes() {
  const { role } = useApp();
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<OTP />} />
      <Route path="/chat" element={<WidgetChat />} />
      <Route path="/rep" element={<ReplyWidgetChat />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/forum/my-posts" element={<MyPosts />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blood-compatibility" element={<BloodCompatibility />} />
      <Route path="*" element={<NotFound />} />
      {/* Admin & Staff */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']} role={role} />
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/request-management" element={<RequestManagement />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/member-management" element={<MemberManagement />} />
        <Route path="/blog-management" element={<BlogManagement />} />
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
