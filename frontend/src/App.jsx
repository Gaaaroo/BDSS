import React, { use, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import Home from "./pages/Landing";
import Posts from "./components/posts";
import { ProfileProvider } from "./Contexts/ProfileContext";

export default function App() {
  return (
    <ProfileProvider>
      <AppRoutes />
    </ProfileProvider>
  );
}
