import React from "react";
import { Link } from "react-router-dom";
import back from "../assets/images/logo.jpg";
export default function BackHome({ className = "w-20 h-24" }) {
  return (
    <div>
      <Link to="/">
        <img src={back} alt="Logo" className={className} />
      </Link>
    </div>
  );
}
