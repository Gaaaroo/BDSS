import React from 'react';
import SideBar from '../Layouts/Sidebar';

export default function Inventory() {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-white fixed h-full">
        <SideBar />
      </div>
      <div className="ml-64 flex-1 p-4">This is inventory</div>
    </div>
  );
}
