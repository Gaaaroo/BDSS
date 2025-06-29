import React from 'react';

export default function ComponentBloodDetail({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[700px] shadow-lg">
        <h2 className="text-xl font-bold text-red-600">Component Details</h2>
        <table className="table-auto w-full text-sm text-gray-800 border border-gray-200 rounded-md overflow-hidden">
          <tbody>
            {[
              ['Blood Type', data.bloodType],
              ['Component Type', data.componentType],
              ['Volume', data.volume],
              ['Status', data.status],
              ['Created Date', data.createdDate?.slice(0, 10)],
              ['Expiry Date', data.expiryDate?.slice(0, 10)],
              ['Note', data.note],
            ].map(([label, value], idx) => (
              <tr
                key={label}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-red-50'}
              >
                <th className="text-left w-48 px-4 py-2 font-semibold text-gray-700 border-b">
                  {label}
                </th>
                <td className="px-4 py-2 border-b">{value || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className="text-xl font-bold text-red-600 mt-5">
          Personal Information
        </h2>
        <table className="table-auto w-full text-sm text-gray-800 border border-gray-200 rounded-md overflow-hidden">
          <tbody>
            {[
              ['Full Name', data.userResponse?.fullName],
              ['Email', data.userResponse?.email],
              ['Date of Birth', data.userResponse?.dob?.slice(0, 10)],
              ['Gender', data.userResponse?.gender],
              ['Blood Type', data.userResponse?.bloodType],
              ['Address', data.userResponse?.address],
            ].map(([label, value], idx) => (
              <tr
                key={label}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-red-50'}
              >
                <th className="text-left w-48 px-4 py-2 font-semibold text-gray-700 border-b">
                  {label}
                </th>
                <td className="px-4 py-2 border-b">{value || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
