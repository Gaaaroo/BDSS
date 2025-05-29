import React from "react";
import Home from "../pages/Landing";
import NotFound from "../pages/NotFound";
import { Route, Routes } from "react-router";
import Posts from "../components/posts";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BloodInfo from "../pages/BloodInfo";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/blood-info" element={<BloodInfo />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
