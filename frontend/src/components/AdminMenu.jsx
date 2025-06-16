import React from 'react';
import Logo from '../assets/images/logo.jpg';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BiChat } from 'react-icons/bi';
import { MessagesSquare, Home } from 'lucide-react';

export default function AdminMenu() {
  const navigate = useNavigate();

  return (
    <>
      <div className="fixed top-0 left-0 h-screen w-64 bg-[#F9B3B3] flex flex-col items-center py-6 z-50">
        {/* Logo */}
        <div className="mb-5">
          <img
            src={Logo}
            alt="Donate Blood"
            className="w-40 h-40 rounded-full border-4 border-white shadow"
          />
        </div>
        {/* Icons */}
        <div className="flex items-center gap-4 justify-between">
          <Link to="/">
            <Home className="w-7 h-7 text-pink-500" />
          </Link>
          <Link to="/forum">
            <MessagesSquare className="w-7 h-7 text-pink-500" />
          </Link>
          <Link to="/rep">
            <BiChat className="w-7 h-7 text-pink-500" />
          </Link>
        </div>
        {/* Staff label */}
        <div className="w-58 mb-8 mt-5 ">
          <button className="w-full h-12 py-2 rounded-full bg-[#F76C6C] text-white font-bold text-lg flex items-center justify-center shadow relative">
            <span className="absolute left-1/5">
              <img
                src={Logo} // đổi avatar staff ở đây nè
                alt="Donate Blood"
                className="w-10 h-10 rounded-full border border-black shadow"
              />
            </span>
            <span className="absolute right-2/7 text-2xl">Staff</span>
          </button>
        </div>
        {/* Menu */}
        <nav className="flex flex-col ">
          <Link
            to="/dashboard"
            className="w-59 h-11 py-2 text-white bg-transparent hover:bg-[#F76C6C] transition-all hover:font-bold
            flex justify-center items-center
            text-[22px] text-center font-semibold
            hover:transform hover:scale-108 shadow rounded-sm"
          >
            Dashboard
          </Link>
          <Link
            to="/"
            className="w-59 h-11 py-2 text-white bg-transparent hover:bg-[#F76C6C] transition-all  hover:font-bold
            flex justify-center items-center
            text-[22px] text-center font-semibold
            hover:transform hover:scale-108 shadow rounded-sm"
          >
            Inventory
          </Link>
          <Link
            to="/"
            className="w-59 h-11 py-2 text-white bg-transparent hover:bg-[#F76C6C] transition-all  hover:font-bold
            flex justify-center items-center
            text-[22px] text-center font-semibold
            hover:transform hover:scale-108 shadow rounded-sm"
          >
            Member
          </Link>
          <Link
            to="/request-management"
            className="w-59 h-11 py-2 text-white bg-transparent hover:bg-[#F76C6C] transition-all  hover:font-bold
            flex justify-center items-center
            text-[22px] text-center font-semibold
            hover:transform hover:scale-108 shadow rounded-sm"
          >
            Request
          </Link>
          <Link
            to="/"
            className="w-59 h-11 py-2 text-white bg-transparent hover:bg-[#F76C6C] transition-all  hover:font-bold
            flex justify-center items-center
            text-[22px] text-center font-semibold
            hover:transform hover:scale-108 shadow rounded-sm"
          >
            Blog
          </Link>
          <Link
            to="/"
            className="w-59 h-11 py-2 text-white bg-transparent hover:bg-[#F76C6C] transition-all  hover:font-bold
            flex justify-center items-center
            text-[22px] text-center font-semibold
            hover:transform hover:scale-108 shadow rounded-sm"
          >
            Log out
          </Link>
        </nav>
      </div>
    </>
  );
}
