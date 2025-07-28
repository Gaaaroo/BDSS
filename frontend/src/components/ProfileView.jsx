import React from 'react';
import MapView from './MapView';

export default function ProfileView({ userData, onEditClick }) {
  const formatField = (value) =>
    value === null || value === undefined || value === '' ? (
      <div className="italic text-gray-500">please update your profile</div>
    ) : (
      value
    );

  return (
    <div className="max-w-7xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl font-sans">
      <div className="grid grid-cols-[37%_60%] gap-10 items-start">
        {/* Left */}
        <div className="flex flex-col items-center text-center w-full">
          <div className="flex flex-col items-center mb-6">
            <img
              src={formatField(userData?.imageLink)}
              alt="Profile"
              className="w-44 h-44 rounded-full object-cover mb-4 border-4 border-red-700"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://firebasestorage.googleapis.com/v0/b/blooddonationsystem-9f456.firebasestorage.app/o/profile-images%2Fmbqqs93k-avatar.webp?alt=media&token=6b9ef0c4-72dc-45e2-9eed-73c64e236d3d';
              }}
            />
            <h2 className="text-4xl font-bold text-red-700">
              {formatField(userData?.fullName)}
            </h2>
          </div>

          <div className="w-full bg-gray-50 rounded-2xl border p-6 shadow-md text-lg text-left">
            <h3 className="text-xl font-semibold text-rose-700 mb-6">
              Personal information
            </h3>
            <div className="space-y-4">
              <div className="flex">
                <div className="min-w-[140px] font-semibold text-gray-600">
                  Full name:
                </div>
                <div>{formatField(userData?.fullName)}</div>
              </div>
              <div className="flex">
                <div className="min-w-[140px] font-semibold text-gray-600">
                  Gender:
                </div>
                <div>{formatField(userData?.gender)}</div>
              </div>
              <div className="flex">
                <div className="min-w-[140px] font-semibold text-gray-600">
                  Date of Birth:
                </div>
                <div>{formatField(userData?.dob)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="w-full bg-gray-50 rounded-2xl border p-6 shadow-md text-lg h-full">
          <h3 className="text-xl font-semibold text-rose-700 mb-6">Contact</h3>
          <div className="space-y-4">
            <div className="flex">
              <div className="min-w-[140px] font-semibold text-gray-600">
                Email:
              </div>
              <div>{formatField(userData?.email)}</div>
            </div>
            <div className="flex">
              <div className="min-w-[140px] font-semibold text-gray-600">
                Phone:
              </div>
              <div>{formatField(userData?.phone)}</div>
            </div>
            <div className="flex">
              <div className="min-w-[140px] font-semibold text-gray-600">
                Blood Type:
              </div>
              <div>{formatField(userData?.bloodType)}</div>
            </div>
            <div className="flex items-start">
              <div className="min-w-[140px] font-semibold text-gray-600">
                Address:
              </div>
              <div className="flex-1">
                {userData?.lat && userData?.lng && userData?.address ? (
                  <MapView
                    initialLocation={{
                      lat: userData?.lat,
                      lng: userData?.lng,
                      address: userData?.address,
                    }}
                  />
                ) : (
                  <div className="italic text-gray-500">
                    please update your profile
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={onEditClick}
              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 cursor-pointer"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
