import React from 'react';
import Sidebar from '../Layouts/Sidebar';

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-white fixed h-full">
        <Sidebar />
      </div>
      <div className="ml-64 flex-1 p-4">This is dashboard</div>
    </div>
  );
}
