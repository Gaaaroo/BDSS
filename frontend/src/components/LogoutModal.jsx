import React from 'react';

export default function LogoutModal({ onCancel, onLogout }) {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-start justify-center z-50 backdrop-brightness-50">
      <div className="bg-white rounded-lg p-6 w-150 shadow-lg m-10">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Logout</h1>
        <p className="text-gray-700 mb-6">Are you sure you want to Logout?</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancle
          </button>
          <button
            className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600"
            onClick={onLogout}
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}
