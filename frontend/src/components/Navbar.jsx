import React, { useEffect, useState } from 'react';
import logo from '../assets/images/logo.jpg';
import { CircleUser, HeartHandshake, House, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { useApp } from '../Contexts/AppContext';
import CustomModal from './CustomModal';
import NotiPopup from './NotiPopup';

// LogoNavbar
function LogoNavbar() {
  const navigate = useNavigate();
  const { role } = useApp();

  const handleClick = () => {
    if (role === 'MEMBER' || role === 'GUEST') {
      navigate('/');
    } else if (role === 'STAFF') {
      navigate('/dashboard/staff-home');
    }
  };

  return (
    <div
      className="flex items-center justify-center space-x-2 text-2xl"
      onClick={handleClick}
    >
      <img src={logo} alt="Logo" className="h-16 w-auto" />
      <h1 className="text-red-700 font-bold">BDSS</h1>
    </div>
  );
}

// Menu
const menuItems = [
  { to: 'top', label: 'Home' },
  { to: 'about', label: 'About us' },
  { to: 'howitworks', label: 'How it works' },
  { to: 'blogs', label: 'Blog' },
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
  const [showModal, setShowModal] = React.useState(false);
  const { logout } = useApp();

  const handleLogout = () => {
    logout();
    setShowModal(false);
    navigate('/');
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const navigate = useNavigate();
  const handleNavigation = (item) => {
    switch (item) {
      case 'Profile':
        navigate('/profile');
        break;
      case 'My activity':
        navigate('/my-activity');
        break;
      case 'Logout':
        setShowModal(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-icon-dropdown')) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
            {['Profile', 'My activity', 'Logout'].map((item) => (
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
      {showModal && (
        <CustomModal
          onCancel={handleCancel}
          onOk={handleLogout}
          title={'Logout'}
          okLable={'Yes, Logout'}
        >
          <p className="text-gray-700 mb-6">Are you sure you want to Logout?</p>
        </CustomModal>
      )}
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
        onClick={() => navigate('/blood-compatibility')}
      />
      <House
        size={52}
        strokeWidth={3}
        absoluteStrokeWidth
        className="hover:text-red-700 cursor-pointer transition-colors"
        onClick={() => navigate('/')}
      />
      <UserIcon />
    </div>
  );
}

// Noti-Icon
function NotiIcon() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span
        className="relative flex items-center justify-center w-[51px] h-[51px] cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        {/* Vòng tròn ngoài */}
        <svg
          className="absolute"
          width={51}
          height={51}
          viewBox="0 0 51 51"
          fill="none"
        >
          <circle
            cx="25.5"
            cy="25.5"
            r="22.5"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="white"
            className="text-gray-700"
          />
        </svg>
        {/* Icon Bell */}
        <Bell className="relative w-7 h-7 text-gray-700" strokeWidth={2.5} />
      </span>
      
      {!open && (
      <div className="absolute top-12 right-0 z-10">
        <NotiPopup />
      </div>
      )}
    </>
  );
}

// Navbar
export default function Navbar({ mode }) {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate('/login');

  const handleMyPostsClick = () => navigate('/forum/my-posts');

  const handleForumClick = () => navigate('/forum');

  const renderContent = () => {
    switch (mode) {
      case 'member':
        return (
          <>
            <LogoNavbar />
            <Menu />
            <div className="flex items-center gap-2">
              <NotiIcon />
              <UserIcon />
            </div>
          </>
        );
      case 'guest':
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
      case 'blood':
        return (
          <>
            <LogoNavbar />
            <House
              size={52}
              strokeWidth={3}
              absoluteStrokeWidth
              className="hover:text-red-700 cursor-pointer transition-colors"
              onClick={() => navigate('/')}
            />
          </>
        );
      case 'forum':
        return (
          <>
            <LogoNavbar />
            <button
              className="ml-4 px-5 py-1.5 text-white bg-red-700 font-bold rounded-lg border-2 border-red-700 hover:bg-red-500 hover:text-white transition cursor-pointer"
              onClick={handleMyPostsClick}
            >
              My Posts
            </button>
          </>
        );
      case 'my-posts':
        return (
          <>
            <LogoNavbar />
            <button
              className="ml-4 px-5 py-1.5 text-white bg-red-700 font-bold rounded-lg border-2 border-red-700 hover:bg-red-500 hover:text-white transition cursor-pointer"
              onClick={handleForumClick}
            >
              Forum
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
