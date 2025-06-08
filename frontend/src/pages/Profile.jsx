import React, { useState } from "react";
import MapSelector from "../components/MapSelector";

export default function Profile() {
  const [location, setLocation] = useState(null);

  const handleLocationSelect = (loc) => {
    setLocation(loc);
    console.log("Selected:", loc);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 rounded-2xl shadow-lg bg-white font-sans">
      {/* User Info */}
      <div className="flex flex-col items-center">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-700"
        />
        <h2 className="mb-2 text-blue-700 text-2xl font-semibold">John Doe</h2>
        <p className="mb-4 text-gray-600">Frontend Developer</p>
        <div className="w-full border-t border-gray-200 pt-4 text-left text-black text-sm">
          <p>
            <span className="font-semibold">Email:</span> john.doe@email.com
          </p>
          <p>
            <span className="font-semibold">Bio:</span> Passionate about
            building beautiful and performant web apps.
          </p>
        </div>
      </div>

      {/* Map Selector */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">
          Chọn vị trí của bạn
        </h3>
        <MapSelector onLocationSelect={handleLocationSelect} />

        {/* Hiển thị Lat/Lng */}
        {location && (
          <div className="mt-4 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Latitude:</span> {location.lat}
            </p>
            <p>
              <span className="font-semibold">Longitude:</span> {location.lng}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
