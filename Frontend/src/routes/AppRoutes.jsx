import React from "react";
import Home from "../pages/Landing";
import NotFound from "../pages/NotFound";
import { Route, Routes } from "react-router";
import Posts from "../components/posts";
import Login from "../pages/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
