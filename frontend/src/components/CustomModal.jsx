import React from 'react';

export default function CustomModal({
  onCancel,
  onOk,
  title,
  children,
  okLable,
}) {
  return (
    <div className="text-base fixed inset-0 bg-opacity-50 flex items-start justify-center z-50 backdrop-brightness-50">
      <div className="bg-white rounded-lg p-4 w-[500px] shadow-lg m-10">
        <h1 className="text-2xl font-bold text-red-700 mb-4">{title}</h1>
        {children}
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600"
            onClick={onOk}
          >
            {okLable ? okLable : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
}
