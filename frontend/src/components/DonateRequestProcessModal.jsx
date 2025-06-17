import React, { useState } from 'react';
import { BiNote } from 'react-icons/bi';

export default function DonateRequestProcessModal({ request, onStepChange }) {
  const [note, setNote] = useState(user.staffNote || '');
  const [openProcessModal, setOpenProcessModal] = useState(false);
  return (
    <div>
      {/* Icon note */}
      <div className="flex items-center justify-center gap-2">
        <button
          title="View & update process"
          onClick={() => setOpenProcessModal(true)}
          className="text-yellow-500 hover:text-yellow-700 text-2xl"
        >
          <BiNote />
        </button>
      </div>

      {/* Modal */}
      {openProcessModal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setOpenProcessModal(false)}
          ></div>
          {/* Modal content */}
          <div className="ml-64 fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[650px] relative">
              <button
                className="absolute top-1 right-4 text-gray-500 hover:text-red-500 text-4xl"
                onClick={() => setOpenProcessModal(false)}
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center text-black">
                Update Process
              </h2>
              {/* Thông tin profile */}
              <div className="mb-4">
                <div className="mb-4">
                  <span className="block font-semibold text-gray-700 mb-1">
                    Fullname:
                  </span>
                  <span className="block text-gray-900">{request.userResponse.fullName}</span>
                </div>
                {/* Các bước quá trình */}
                <div className="mb-4">
                  <span className="block font-semibold text-gray-700 mb-1">
                    Steps:
                  </span>
                  <ul className="space-y-2">
                    {user.steps?.map((step, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <span className="min-w-[160px] text-gray-600">
                          {step.name}:
                        </span>
                        <select
                          value={step.status}
                          onChange={(e) => onStepChange(idx, e.target.value)}
                          className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                          <option value="failed">Failed</option>
                        </select>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Staff note */}
                <div>
                  <span className="block font-semibold text-gray-700 mb-1">
                    Staff note: {req}
                  </span>
                  <textarea
                    className="border rounded w-full mt-1 p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={user.staffNotes}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder="Enter staff note..."
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
