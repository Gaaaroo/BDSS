import React, { useState } from 'react';
import BloodRequestDashboard from './BloodRequestDashboard';
import BloodReceiveRequestDashboard from './BloodReceiveRequestDashboard';

export default function BloodRequestToggle() {
  const [showReceive, setShowReceive] = useState(true);

  return (
    <div className="flex flex-col items-center gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-red-600 mb-6 mt-7">
          
        </h1>
      </div>
      <div className="flex gap-4 justify-center items-center">
        <button
          className={`px-4 py-2 rounded-full font-semibold  ${
            showReceive
              ? 'bg-red-400 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-red-100'
          }`}
          onClick={() => setShowReceive(true)}
        >
          Seek Blood Request
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            !showReceive
              ? 'bg-red-400 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-red-100'
          }`}
          onClick={() => setShowReceive(false)}
        >
          Donate Blood Request
        </button>
      </div>
      <div className="mt-6 w-full">
        {showReceive ? (
          <div>
            <BloodReceiveRequestDashboard />
          </div>
        ) : (
          <div>
            <BloodRequestDashboard />
          </div>
        )}
      </div>
    </div>
  );
}
