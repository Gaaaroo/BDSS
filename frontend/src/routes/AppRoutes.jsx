import React from "react";
import Home from "../pages/Landing";
import NotFound from "../pages/NotFound";
import { Route, Routes } from "react-router";
import Posts from "../components/posts";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BloodCompatibility from "../pages/BloodCompatibility";
import WidgetChat from "../components/WidgetChat";
import ReplyWidgetChat from "../components/ReplyWidgetChat";
<<<<<<< HEAD
import Donor from "../pages/Donor";
import Seeker from "../pages/Seeker";
import MyActivity from "../pages/MyActivity";
import Profile from "../pages/Profile";
=======
>>>>>>> 3487bd4dc954f352e29dfdc1b09056915824fa2e

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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
