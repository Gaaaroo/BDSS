import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router';

export default function LayoutStaff() {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-white fixed h-full">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64">
        <Outlet />
      </div>
    </div>
  );
}
