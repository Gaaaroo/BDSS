import React, { useState } from 'react';
import Logo from '../assets/images/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { BiChat } from 'react-icons/bi';
import {
  MessagesSquare,
  Home,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Boxes,
  Users,
  LogOut,
  Newspaper,
  ClipboardList,
} from 'lucide-react';
import { useApp } from '../Contexts/AppContext';
import CustomModal from '../components/CustomModal';

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showInventorySubmenu, setShowInventorySubmenu] = useState(false);
  const handleInventoryClick = () => {
    setShowInventorySubmenu(!showInventorySubmenu);
  };
  const handleClick = (e) => {
    e.preventDefault(); //ngăn link điều hướng ngay lập tức
    setShowModal(true);
  };
  const handleCancel = () => {
    setShowModal(false);
  };
  const handleLogout = () => {
    logout();
    setShowModal(false);
    navigate('/');
  };
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
            className="w-59 h-11 p-2 text-white bg-transparent hover:bg-[#F76C6C] transition-all hover:font-bold
            flex justify-start items-center gap-2 text-2xl font-semibold hover:transform hover:scale-108 shadow rounded-sm"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <button
            onClick={handleInventoryClick}
            className="w-59 h-11 p-2 text-white bg-transparent hover:bg-[#F76C6C] transition-all hover:font-bold
            flex justify-between items-center text-2xl font-semibold hover:transform hover:scale-108 shadow rounded-sm"
          >
            <span className="flex items-center gap-2">
              <Boxes className="w-5 h-5" />
              Inventory
            </span>
            {showInventorySubmenu ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>

          {showInventorySubmenu && (
            <div className="ml-6 mt-2 flex flex-col border-l border-white/30 pl-4 space-y-2 transition-all duration-300">
              <Link
                to="/inventory/whole"
                className="text-white flex justify-between text-base py-1 px-2 hover:bg-[#f76c6c] rounded-md transition-colors flex items-center gap-2"
              >
                Whole
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/inventory/components"
                className="text-white flex justify-between text-base py-1 px-2 hover:bg-[#f76c6c] rounded-md transition-colors flex items-center gap-2"
              >
                Components
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}

          <Link
            to="/member-management"
            className="w-59 h-11 p-2 text-white bg-transparent hover:bg-[#F76C6C] transition-all  hover:font-bold
            flex justify-start items-center text-2xl font-semibold hover:transform hover:scale-108 shadow rounded-sm gap-2"
          >
            <Users className="w-5 h-5" />
            Member
          </Link>
          <Link
            to="/request-management"
            className="w-59 h-11 p-2 text-white bg-transparent hover:bg-[#F76C6C] transition-all  hover:font-bold
            flex justify-start items-center text-2xl font-semibold
            hover:transform hover:scale-108 shadow rounded-sm gap-2"
          >
            <ClipboardList className="w-5 h-5" />
            Request
          </Link>
          <Link
            to="/blog-management"
            className="w-59 h-11 p-2 text-white bg-transparent hover:bg-[#F76C6C] transition-all hover:font-bold
            flex justify-start items-center
            text-2xl font-semibold
            hover:transform hover:scale-108 shadow rounded-sm gap-2"
          >
            <Newspaper className="w-5 h-5" />
            Blog
          </Link>
          <Link
            to="/login" //Không dùng trực tiếp, dùng để hợp chuẩn
            onClick={handleClick}
            className="w-59 h-11 p-2 text-white bg-transparent hover:bg-[#F76C6C] transition-all  hover:font-bold
            flex  justify-start items-center
            text-2xl font-semibold
            hover:transform hover:scale-108 shadow rounded-sm gap-2"
          >
            <LogOut className="w-5 h-5" />
            Log out
          </Link>
          {showModal && (
            <CustomModal
              onCancel={handleCancel}
              onOk={handleLogout}
              title={'Logout'}
              okLable={'Yes, Logout'}
            >
              <p className="text-gray-700 mb-6">
                Are you sure you want to Logout?
              </p>
            </CustomModal>
          )}
        </nav>
      </div>
    </>
  );
}
