import React from "react";
import logo from "../assets/images/logo.jpg";
import { CircleUser, HeartHandshake, House, Link } from "lucide-react";
import { useNavigate } from "react-router";

export default function Navbar({ showMenu } = true) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="px-20 p-2 flex flex-col bg-white border-b-2 border-red-600">
        <div className="flex items-center justify-between text-2xl">
          <img src={logo} alt="Logo" className="h-20 w-15" />
          <h1 className="text-red-700 font-bold">BDSS</h1>
          {showMenu && (
            <nav className="flex-1 flex justify-center">
              <ul className="flex font-semibold">
                <li className="mx-10 hover:text-red-700 cursor-pointer transition-colors">
                  Home
                </li>
                <li className="mx-10 hover:text-red-700 cursor-pointer transition-colors">
                  About us
                </li>
                <li className="mx-10 hover:text-red-700 cursor-pointer transition-colors">
                  How it works
                </li>
                <li className="mx-10 hover:text-red-700 cursor-pointer transition-colors">
                  Blog
                </li>
              </ul>
            </nav>
          )}
          <div className="flex items-center space-x-5 ml-auto">
            {!showMenu ? (
              <>
                <HeartHandshake
                  size={50}
                  strokeWidth={3}
                  absoluteStrokeWidth
                  className="hover:text-red-700 cursor-pointer transition-colors"
                />
                <House
                  size={50}
                  strokeWidth={3}
                  absoluteStrokeWidth
                  className="hover:text-red-700 cursor-pointer transition-colors"
                />
                <CircleUser
                  size={50}
                  strokeWidth={3}
                  absoluteStrokeWidth
                  className="hover:text-red-700 cursor-pointer transition-colors"
                />
              </>
            ) : (
              <button
                className="ml-4 px-5 py-1.5 text-white bg-red-700 font-bold rounded-lg border-2 border-red-700 hover:bg-red-500 hover:text-white transition"
                onClick={handleLoginClick}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
