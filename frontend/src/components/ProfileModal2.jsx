import React, { useState } from 'react';
import { BiUserCircle } from 'react-icons/bi';
import dayjs from 'dayjs';

export default function ExampleProfileModal({ request }) {
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <div>
      {/* Nút mở modal */}
      <div className="flex items-center justify-center gap-2">
        <button title="Profile">
          <BiUserCircle
            className="text-2xl text-gray-600 hover:text-gray-900 transition"
            onClick={() => setOpenProfile(true)}
          />
        </button>
      </div>

      {/* Modal */}
      {openProfile && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setOpenProfile(false)}
            ></div>
            {/* Modal content */}
            <div className="relative ml-64 bg-white rounded-xl shadow-2xl p-8 w-[550px] z-10 flex flex-col items-center">
              <button
                className="absolute top-2 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold"
                onClick={() => setOpenProfile(false)}
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-6 text-center text-[#F76C6C] tracking-wide">
                User Profile
              </h2>
              {/* Avatar */}
              {request.user.imageLink && (
                <img
                  src={request.user.imageLink}
                  alt="User Avatar"
                  className="w-28 h-28 rounded-full object-cover mb-5 border-4 border-[#F9B3B3] shadow"
                />
              )}
              <div className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
                {request.user.fullName}
              </div>
              {/* Line */}
              <div className="w-full border-t border-[#F9B3B3] mb-4"></div>
              {/* Thông tin profile */}
              <div className="space-y-4 text-[16px] w-full">
                <ProfileRow label="Gender" value={request.user.gender} />
                <ProfileRow label="Phone" value={request.user.phone} />
                <ProfileRow label="Email" value={request.user.email} />
                <ProfileRow
                  label="Request Date"
                  value={dayjs(request.requestDate).format('DD-MM-YYYY')}
                />
                <ProfileRow
                  label="Address"
                  value={request.user.address}
                  valueClass="break-words max-w-full"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Component cho từng dòng thông tin
function ProfileRow({ label, value, valueClass = '' }) {
  return (
    <div className="flex items-start mb-2 w-full">
      <span className="font-semibold w-36 min-w-[120px] text-gray-600 text-left pr-4 ml-10 flex-shrink-0">
        {label}
      </span>
      <span
        className={`text-gray-900 min-w-[120px] text-right break-words flex-1 mr-10 ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}