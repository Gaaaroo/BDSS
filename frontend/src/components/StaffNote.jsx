import { PhoneCall, UserRound } from 'lucide-react';
import React from 'react';

export default function StaffNote({ noteStaff, dateUpdate, nameStaff }) {
  return (
    <div className="px-[150px] p-10 pb-15">
      <div className="w-full mx-auto bg-white border-1 border-red-500 rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-red-100 via-red-50 to-white rounded-t-md border-b border-red-100">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-1 rounded-full shadow">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <UserRound strokeWidth={2} />
              </svg>
              <span className="font-semibold">{nameStaff}</span>
            </div>
            <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-1 rounded-full shadow">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <PhoneCall strokeWidth={2} />
              </svg>
              <span className="font-semibold">{dateUpdate}</span>
            </div>
          </div>
          <span className="bg-red-200 px-5 py-1.5 text-base font-bold rounded-full shadow text-red-800 tracking-wide border border-red-300">
            Staff Note
          </span>
        </div>
        <div className="p-8 min-h-[200px] text-gray-800 text-lg leading-relaxed bg-white rounded-b-3xl">
          {noteStaff}
        </div>
      </div>
    </div>
  );
}
