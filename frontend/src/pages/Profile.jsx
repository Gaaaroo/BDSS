import React from "react";

export default function Profile() {
  return (
    <div className="max-w-md mx-auto mt-10 p-8 rounded-2xl shadow-lg bg-white font-sans">
      <div className="flex flex-col items-center">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-700"
        />
        <h2 className="mb-2 text-blue-700 text-2xl font-semibold">John Doe</h2>
        <p className="mb-4 text-gray-600">Frontend Developer</p>
        <div className="w-full border-t border-gray-200 pt-4 text-left">
          <p>
            <span className="font-semibold">Email:</span> john.doe@email.com
          </p>
          <p>
            <span className="font-semibold">Location:</span> New York, USA
          </p>
          <p>
            <span className="font-semibold">Bio:</span> Passionate about
            building beautiful and performant web apps.
          </p>
        </div>
        
      </div>
    </div>
  );
}
