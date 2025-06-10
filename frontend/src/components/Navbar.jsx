import React, { useEffect } from "react";
import logo from "../assets/images/logo.jpg";
import { CircleUser, HeartHandshake, House } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
//import { useState } from "react";

// LogoNavbar
// onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
function LogoNavbar() {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center justify-center space-x-2 text-2xl"
      onClick={() => navigate("/")}
    >
      <img src={logo} alt="Logo" className="h-16 w-auto" />
      <h1 className="text-red-700 font-bold">BDSS</h1>
    </div>
  );
}

// Menu
const menuItems = [
  { to: "top", label: "Home" },
  { to: "about", label: "About us" },
  { to: "howitworks", label: "How it works" },
  { to: "blogs", label: "Blog" },
];

function Menu() {
  return (
    <nav className="flex justify-center font-extrabold text-[28px] text-gray-700">
      <ul className="flex font-semibold">
        {menuItems.map(({ to, label }) => (
          <li
            key={to}
            className="mx-10 hover:text-red-700 cursor-pointer transition-colors"
          >
            <ScrollLink
              to={to}
              smooth
              duration={500}
              offset={-80}
              className="cursor-pointer"
            >
              {label}
            </ScrollLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// UserIcon
function UserIcon() {
  const [open, setOpen] = React.useState(false);
  // const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };
  const navigate = useNavigate();
  const handleNavigation = (item) => {
    switch (item) {
      case "Profile":
        navigate("/profile");
        break;
      case "My activity":
        navigate("/my-activity");
        break;
      case "Logout":
        // setShowModal(true);
        handleLogout();
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-icon-dropdown")) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative user-icon-dropdown">
      <CircleUser
        size={52}
        strokeWidth={3}
        absoluteStrokeWidth
        className="hover:text-red-700 cursor-pointer transition-colors"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="absolute right-0 w-48 bg-white border border-red-200 rounded-lg shadow-lg z-10">
          <ul className="py-2">
            {["Profile", "My activity", "Logout"].map((item) => (
              <li
                key={item}
                className="px-4 py-2 hover:bg-red-100 cursor-pointer"
                onClick={() => handleNavigation(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold text-red-700 mb-4">Logout</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                onClick={handleCancelLogout}
              >
                Cancle
              </button>
              <button
                className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600"
                onClick={handleConfirmLogout}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

// Icon
function Icon() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center space-x-4">
      <HeartHandshake
        size={52}
        strokeWidth={3}
        absoluteStrokeWidth
        className="hover:text-red-700 cursor-pointer transition-colors"
        onClick={() => navigate("/blood-compatibility")}
      />
      <House
        size={52}
        strokeWidth={3}
        absoluteStrokeWidth
        className="hover:text-red-700 cursor-pointer transition-colors"
        onClick={() => navigate("/")}
      />
      <UserIcon />
    </div>
  );
}

// Navbar
export default function Navbar({ mode }) {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/login");

  const renderContent = () => {
    switch (mode) {
      case "member":
        return (
          <>
            <LogoNavbar />
            <Menu />
            <UserIcon />
          </>
        );
      case "guest":
        return (
          <>
            <LogoNavbar />
            <Menu />
            <button
              className="ml-4 px-5 py-1.5 text-white bg-red-700 font-bold rounded-lg border-2 border-red-700 hover:bg-red-500 hover:text-white transition"
              onClick={handleLoginClick}
            >
              Login
            </button>
          </>
        );
      case "blood":
        return (
          <>
            <LogoNavbar />
            <House
              size={52}
              strokeWidth={3}
              absoluteStrokeWidth
              className="hover:text-red-700 cursor-pointer transition-colors"
              onClick={() => navigate("/")}
            />
          </>
        );
      case "login":
        return (
          <>
            <LogoNavbar />
            <button
              className="ml-4 px-5 py-1.5 text-white bg-red-700 font-bold rounded-lg border-2 border-red-700 hover:bg-red-500 hover:text-white transition"
              onClick={handleLoginClick}
            >
              Login
            </button>
          </>
        );
      default:
        return (
          <>
            <LogoNavbar />
            <Icon />
          </>
        );
    }
  };

  return (
    <div className="flex items-center justify-between bg-white px-20 border-b-2 border-red-600 text-gray-700 text-2xl">
      {renderContent()}
    </div>
  );
}

export { LogoNavbar, Menu, UserIcon, Icon };
