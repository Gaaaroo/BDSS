import React from "react";
import MapSelector from "./MapSelector";

export default function ProfileView({ userData, onEditClick }) {
  return (
    <div className="max-w-7xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl font-sans">
      <div className="grid grid-cols-[37%_60%] gap-10 items-start">
        {/* Left */}
        <div className="flex flex-col items-center text-center w-full">
          <div className="flex flex-col items-center mb-6">
            <img
              src={userData.image_link}
              alt="Profile"
              className="w-44 h-44 rounded-full object-cover mb-4 border-4 border-red-700"
            />
            <h2 className="text-4xl font-bold text-red-700">
              {userData.username}
            </h2>
          </div>

          <div className="w-full bg-gray-50 rounded-2xl border p-6 shadow-md text-lg text-left">
            <h3 className="text-xl font-semibold text-gray-700 mb-6">
              Thông tin cá nhân
            </h3>
            <div className="space-y-4">
              <div className="flex">
                <div className="min-w-[140px] font-semibold text-gray-600">
                  Full name:
                </div>
                <div>{userData.full_name}</div>
              </div>
              <div className="flex">
                <div className="min-w-[140px] font-semibold text-gray-600">
                  Gender:
                </div>
                <div>{userData.gender}</div>
              </div>
              <div className="flex">
                <div className="min-w-[140px] font-semibold text-gray-600">
                  Date of Birth:
                </div>
                <div>{userData.dob}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="w-full bg-gray-50 rounded-2xl border p-6 shadow-md text-lg h-full">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">Liên hệ</h3>
          <div className="space-y-4">
            <div className="flex">
              <div className="min-w-[140px] font-semibold text-gray-600">
                Email:
              </div>
              <div>{userData.email}</div>
            </div>
            <div className="flex">
              <div className="min-w-[140px] font-semibold text-gray-600">
                Phone:
              </div>
              <div>{userData.phone}</div>
            </div>
            <div className="flex">
              <div className="min-w-[140px] font-semibold text-gray-600">
                Blood Type:
              </div>
              <div>{userData.blood_type}</div>
            </div>
            <div className="flex items-start">
              <div className="min-w-[140px] font-semibold text-gray-600 mt-2">
                Address:
              </div>
              <div className="flex-1">
                <MapSelector
                  readOnly
                  initialLocation={{
                    lat: userData.lat,
                    lng: userData.lng,
                    address: userData.address,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={onEditClick}
              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
