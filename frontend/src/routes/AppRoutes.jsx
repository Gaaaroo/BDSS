import React from 'react';
import Home from '../pages/Landing';
import NotFound from '../pages/NotFound';
import { Route, Routes } from 'react-router';
import Posts from '../components/posts';
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
import AdminMenu from '../components/AdminMenu';
import RequestManagement from '../pages/RequestManagement';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/blood-compatibility" element={<BloodCompatibility />} />
      <Route path="/become-a-donor" element={<Donor />} />
      <Route path="/become-a-seeker" element={<Seeker />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/my-activity" element={<MyActivity />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/chat" element={<WidgetChat />} />
      <Route path="/rep" element={<ReplyWidgetChat />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/forum/my-posts" element={<MyPosts />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/verify-otp" element={<OTP />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/dashboard" element={<AdminMenu />} />
      <Route path="/request-management" element={<RequestManagement />} />
    </Routes>
  );
}
