import React from 'react';
import SideBar from '../Layouts/Sidebar';

export default function Components() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white fixed h-full">
        <SideBar />
      </div>
      <div className="ml-64 flex-1 p-4">This is component</div>
    </div>
  );
}
