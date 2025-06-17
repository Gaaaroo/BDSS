import React, { useState } from 'react';
import BloodRequestTable from './BloodRecieveRequestTable';
import BloodDonateRequestTable from './BloodDonateRequestTable';

export default function BloodRequestToggle() {
  const [showReceive, setShowReceive] = useState(true);

  return (
    <div className="ml-64">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4 justify-center items-center">
          <button
            className={`px-4 py-2 rounded-full font-semibold  ${
              showReceive
                ? 'bg-red-400 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-red-100'
            }`}
            onClick={() => setShowReceive(true)}
          >
            Receive Blood Request
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
              <div className="text-center text-lg font-bold text-red-500">
                Receive Blood Request Content
              </div>
              <div className="flex gap-8 mt-8 justify-center items-center">
                <div className="bg-[#F9B3B3] rounded-lg px-8 py-4 flex flex-col items-center shadow">
                  <span className="text-2xl font-bold text-red-600">6</span>
                  <span className="text-white font-medium">
                    Requests Cancel
                  </span>
                </div>
                <div className="bg-[#F9B3B3] rounded-lg px-8 py-4 flex flex-col items-center shadow">
                  <span className="text-2xl font-bold text-cyan-400">4</span>
                  <span className="text-white font-medium">
                    Requests In Process
                  </span>
                </div>
                <div className="bg-[#F9B3B3] rounded-lg px-8 py-4 flex flex-col items-center shadow">
                  <span className="text-2xl font-bold text-green-500">6</span>
                  <span className="text-white font-medium">
                    Requests Approve
                  </span>
                </div>
                <div className="bg-[#F9B3B3] rounded-lg px-8 py-4 flex flex-col items-center shadow">
                  <span className="text-2xl font-bold text-yellow-400">6</span>
                  <span className="text-white font-medium">
                    Requests Placed
                  </span>
                </div>
              </div>
              <BloodRequestTable />
            </div>
          ) : (
            <div>
              <div className="text-center text-lg font-bold text-red-500">
                Donate Blood Request Content
              </div>
              <div className="flex gap-8 mt-8 justify-center items-center">
                <div className="bg-[#F9B3B3] rounded-lg px-8 py-4 flex flex-col items-center shadow">
                  <span className="text-2xl font-bold text-yellow-400">6</span>
                  <span className="text-white font-medium">
                    Pending Request
                  </span>
                </div>
                <div className="bg-[#F9B3B3] rounded-lg px-8 py-4 flex flex-col items-center shadow">
                  <span className="text-2xl font-bold text-cyan-400">4</span>
                  <span className="text-white font-medium">
                    Processing Request
                  </span>
                </div>
                <div className="bg-[#F9B3B3] rounded-lg px-8 py-4 flex flex-col items-center shadow">
                  <span className="text-2xl font-bold text-green-500">6</span>
                  <span className="text-white font-medium">
                    Approved Request
                  </span>
                </div>
                <div className="bg-[#F9B3B3] rounded-lg px-8 py-4 flex flex-col items-center shadow">
                  <span className="text-2xl font-bold text-red-600">6</span>
                  <span className="text-white font-medium">
                    Cancelled Request
                  </span>
                </div>
              </div>
              <BloodDonateRequestTable />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
