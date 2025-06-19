import React, { useState } from 'react';
import { BiUser } from 'react-icons/bi';

export default function ExampleProfileModal({ user }) {
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <div>
      {/* Nút mở modal */}
      <div className="flex items-center justify-center gap-2">
      <button
        title="View profile"
        className="text-cyan-500 hover:text-cyan-700 text-2xl"
        onClick={() => setOpenProfile(true)}
      >
        <BiUser />
      </button>
      </div>

      {/* Modal */}
      {openProfile && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setOpenProfile(false)}
          ></div>
          {/* Modal content */}
          <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-40"></div>
          <div className="ml-64 fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[650px] relative">
              <button
                className="absolute top-1 right-4 text-gray-500 hover:text-red-500 text-4xl"
                onClick={() => setOpenProfile(false)}
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-6 ml-7 text-left text-black">
                User Profile
              </h2>
              {/* Hiển thị thông tin profile */}
              <div className="flex items-center justify-center">
                <div className="space-y-2 text-[16px] ">
                  <div className="flex">
                    <span className="font-semibold w-36 text-gray-600 text-left">
                      Fullname:
                    </span>
                    <span className="text-gray-900 text-left">
                      {user.userResponse.fullName}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-36 text-gray-600 text-left">
                      Gender:
                    </span>
                    <span className="text-gray-900">{user.userResponse.gender}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-36 text-gray-600 text-left">
                      Date of birth:
                    </span>
                    <span className="text-gray-900">{user.userResponse.dob}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-36 text-gray-600 text-left">
                      Blood type:
                    </span>
                    <span className="text-gray-900">{user.userResponse.bloodType}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-36 text-gray-600 text-left">
                      Phone:
                    </span>
                    <span className="text-gray-900">{user.userResponse.phone}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-36 text-gray-600 text-left">
                      Address:
                    </span>
                    <span className="text-gray-900 text-left break-words max-w-[400px]">
                      {user.userResponse.address}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-36 text-gray-600 text-left">
                      Health note:
                    </span>
                    <span className="text-gray-900 text-left">
                      {user.healthNotes !== null ? user.healthNotes
                        : 'Normal'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
