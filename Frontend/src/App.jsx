import React, { use, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import Home from "./pages/Landing";
import Posts from "./components/posts";

export default function App() {
  return (
    <div className="max-w-[1920px] mx-auto">
      <AppRoutes />
    </div>
  );
}
