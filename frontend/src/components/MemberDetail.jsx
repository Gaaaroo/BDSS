import React from 'react';

export default function MemberDetail({ data, onClose }) {
  return (
    <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[700px] shadow-lg">
        <h2 className="text-xl font-bold text-red-600 mb-4">Member Details</h2>

        <table className="table-auto w-full text-sm text-gray-800 border border-gray-200 rounded-md overflow-hidden">
          <tbody>
            {[
              ['Full Name', data.fullName],
              ['Username', data.username],
              ['Email', data.email],
              ['Phone', data.phone],
              ['Gender', data.gender],
              ['Date of Birth', data.dob?.slice(0, 10)],
              ['Blood Type', data.bloodType],
              ['Address', data.address],
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
