import React, { useState, useEffect } from 'react';
import { BiNote } from 'react-icons/bi';
import { getReceiveRequestById } from '../services/api/bloodRequestService';
import ReceiveStepProgress from './ReceiveStepProgress';

export default function ReceiveRequestProcessModal({ request, onReloadTable }) {
  const [openProcessModal, setOpenProcessModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(request);

  const reloadRequest = async () => {
    const res = await getReceiveRequestById(request.receiveId);
    setCurrentRequest(res);
    console.log('Reloaded request:', res);
  };

  // Fetch lại dữ liệu mới nhất khi mở modal
  const handleOpenModal = async () => {
    try {
      const res = await getReceiveRequestById(request.receiveId);
      setCurrentRequest(res);
      setOpenProcessModal(true);
    } catch (error) {
      setCurrentRequest(request); // fallback nếu lỗi
      setOpenProcessModal(true);
    }
  };

  return (
    <div>
      {/* Icon note */}
      <div className="flex items-center justify-center gap-2">
        <button title="View & update process" onClick={handleOpenModal}>
          <BiNote className="text-2xl text-blue-500 hover:text-blue-700 transition" />
        </button>
      </div>

      {/* Modal */}
      {openProcessModal && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
              className=" inset-0 bg-black/30 absolute"
              onClick={() => setOpenProcessModal(false)}
            ></div>
            {/* Modal content */}
            <div className="ml-64 relative  inset-0 flex items-center justify-center z-10">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[650px] relative">
                <button
                  className="absolute top-1 right-4 text-gray-500 hover:text-red-500 text-4xl"
                  onClick={() => setOpenProcessModal(false)}
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center text-black">
                  Donation Process
                </h2>
                {/* Thông tin profile */}
                <div className="">
                  <div className="mb-4 flex justify-between gap-4">
                    {/* Donor name box */}
                    <div className="flex items-center rounded-[50px] px-2 py-1 bg-[#F9B3B3] min-w-[140px] ml-3">
                      <span className="font-semibold text-gray-700 mr-1">
                        Donor name:
                      </span>
                      <span className="text-gray-900">
                        {currentRequest.user.fullName}
                      </span>
                    </div>
                    {/* Phone box */}
                    <div className="flex items-center  rounded-[50px] px-2 py-1 bg-[#F9B3B3] min-w-[110px] mr-3">
                      <span className="font-semibold text-gray-700 mr-1">
                        Phone:
                      </span>
                      <span className="text-gray-900">
                        {currentRequest.user.phone}
                      </span>
                    </div>
                  </div>

                  {/* Các bước quá trình */}
                  <ReceiveStepProgress
                    steps={currentRequest.steps}
                    onReload={reloadRequest}
                    receiveId={currentRequest.receiveId}
                    onReloadTable={onReloadTable}
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
