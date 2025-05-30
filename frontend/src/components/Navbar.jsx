import React from "react";
import logo from "../assets/images/logo.jpg";
import { CircleUser, HeartHandshake, House, Link } from "lucide-react";
import { useNavigate } from "react-router";
import { Link as ScrollLink } from "react-scroll";
export function LogoNavbar() {
  return (
    <div className="flex items-center justify-center space-x-2 text-2xl">
      <img src={logo} alt="Logo" className="h-16 w-auto" />
      <h1 className="text-red-700 font-bold">BDSS</h1>
    </div>
  );
}

export function Menu({ onScroll }) {
  return (
    <nav className="flex justify-center font-extrabold text-[28px] text-gray-700">
      <ul className="flex font-semibold">
        <li
          className="mx-10 hover:text-red-700 cursor-pointer transition-colors"
          onClick={onScroll} // <- Gọi scrollToTop khi click "Home"
        >
          <ScrollLink
            to="top"
            smooth={true}
            duration={500}
            offset={-80}
            className="cursor-pointer"
          >
            Home
          </ScrollLink>
        </li>
        <li className="mx-10 hover:text-red-700 cursor-pointer transition-colors">
          <ScrollLink
            to="about"
            smooth={true}
            duration={500}
            offset={-80}
            className="cursor-pointer"
          >
            About us
          </ScrollLink>
        </li>
        <li className="mx-10 hover:text-red-700 cursor-pointer transition-colors">
          <ScrollLink
            to="howitworks"
            smooth={true}
            duration={500}
            offset={-80}
            className="cursor-pointer"
          >
            How it works
          </ScrollLink>
        </li>
        <li className="mx-10 hover:text-red-700 cursor-pointer transition-colors">
          <ScrollLink
            to="blogs"
            smooth={true}
            duration={500}
            offset={-80}
            className="cursor-pointer"
          >
            Blog
          </ScrollLink>
        </li>
      </ul>
    </nav>
  );
}

export function UserIcon() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <CircleUser
        size={52}
        strokeWidth={3}
        absoluteStrokeWidth
        className="hover:text-red-700 cursor-pointer transition-colors"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <ul className="py-2">
            <li className="px-4 py-2 hover:bg-red-100 cursor-pointer">
              Profile
            </li>
            <li className="px-4 py-2 hover:bg-red-100 cursor-pointer">
              Settings
            </li>
            <li className="px-4 py-2 hover:bg-red-100 cursor-pointer">
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export function Icon() {
  return (
    <>
      <div className="flex items-center justify-center space-x-4">
        <HeartHandshake
          size={52}
          strokeWidth={3}
          absoluteStrokeWidth
          className="hover:text-red-700 cursor-pointer transition-colors"
        />
        <House
          size={52}
          strokeWidth={3}
          absoluteStrokeWidth
          className="hover:text-red-700 cursor-pointer transition-colors"
        />
        <CircleUser
          size={52}
          strokeWidth={3}
          absoluteStrokeWidth
          className="hover:text-red-700 cursor-pointer transition-colors"
        />
      </div>
    </>
  );
}

export default function Navbar({ isLogin }) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  if (isLogin === "yes") {
    return (
      <>
        <div className="flex items-center justify-between bg-white px-20 border-b-2 border-red-600 text-gray-700 text-2xl">
          <LogoNavbar />
          <Menu />
          <UserIcon />
        </div>
      </>
    );
  } else if (isLogin === "no") {
    return (
      <>
        <div className="flex items-center justify-between bg-white px-20 border-b-2 border-red-600 text-gray-700 text-2xl">
          <LogoNavbar />
          <Menu />
          <button
            className="ml-4 px-5 py-1.5 text-white bg-red-700 font-bold rounded-lg border-2 border-red-700 hover:bg-red-500 hover:text-white transition"
            onClick={handleLoginClick}
          >
            Login
          </button>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="flex items-center justify-between bg-white px-20 border-b-2 border-red-600 text-gray-700 text-2xl">
          <LogoNavbar />
          <Icon />
        </div>
      </>
    );
  }
}
