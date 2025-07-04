import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import {
  getAllBloodReceiveRequests,
  searchBloodReceiveRequests,
} from '../services/api/bloodRequestService';
import { BiNote, BiUserCircle } from 'react-icons/bi';
import ProfileModal2 from './ProfileModal2';
import ReceiveRequestProcessModal from './ReceiveRequestProcessModal';

function getStatusColor(status) {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-400 text-white';
    case 'PROCESSING':
      return 'bg-cyan-400 text-white';
    case 'REJECTED':
      return 'bg-red-400 text-white';
    default:
      return 'bg-gray-300 text-black';
  }
}

export default function BloodReceiveRequestTable({
  selectedStatus,
  triggerReloadCount,
  onClearStatus,
}) {
  const [keyword, setKeyword] = useState('');
  const [receiveRequests, setReceiveRequests] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const [showUrgent, setShowUrgent] = useState(false);

  // view all donate request and search posts by keyword
  const fetchRequests = useCallback(async () => {
    try {
      console.log('Search keyword:', keyword);
      let data;
      if (keyword.trim() === '') {
        data = await getAllBloodReceiveRequests();
        console.log('Fetching all posts:', data);
      } else {
        data = await searchBloodReceiveRequests(keyword.trim());
      }
      setReceiveRequests(
        data.map((request) => ({
          ...request,
          id: request.receiveId,
        }))
      );
      console.log('Posts fetched successfully', data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setReceiveRequests([]);
    }
  }, [keyword]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests, triggerReloadCount]);

  // const filteredRequests = selectedStatus
  //   ? receiveRequests.filter((req) => req.status === selectedStatus)
  //   : receiveRequests;

  const filteredRequests = receiveRequests.filter((req) => {
    const matchUrgent = showUrgent
      ? req.priority?.toLowerCase() === 'urgent'
      : true;
    const matchStatus = selectedStatus ? req.status === selectedStatus : true;
    return matchUrgent && matchStatus;
  });

  // Modal handler for long hospital address
  const handleShowModal = (content) => {
    setModalContent(splitByLength(content, 50) || 'NO ADDRESS');
    setShowAddressModal(true);
  };

  function splitByLength(str, n) {
    if (!str) return '';
    return str.match(new RegExp('.{1,' + n + '}', 'g')).join('\n');
  }

  //   function insertLineBreaks(str, maxLen) {
  //   let result = '';
  //   for (let i = 0; i < str.length; i += maxLen) {
  //     result += str.slice(i, i + maxLen) + '\n';
  //   }
  //   return result;
  // }

  return (
    <div className="w-full flex justify-center items-center">
      <div
        className="overflow-hidden bg-white rounded-xl pt-5 p-3 shadow border
        w-full border-gray-200 mt-10 m-5"
      >
        {/* Search and filter */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search by fullname, phone, blood type..."
              className="border border-[#F9B3B3] rounded-full pl-4 pr-9 py-2 outline-none
      text-gray-700 w-full text-sm h-8
      bg-pink-50 focus:ring-2 focus:ring-[#F9B3B3] transition"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <div className="absolute right-2 top-1 text-[#F9B3B3] text-lg pointer-events-none">
              🔍
            </div>
          </div>

          <div className="flex items-center gap-3">
          {/*Urgent button*/}
          <button
            className={`rounded-full px-3 text-sm h-7 flex items-center justify-center
    transition-colors duration-200 hover:text-white hover:font-bold 
    hover:transform hover:scale-105 hover:bg-red-500 w-[105px]
    ${
      showUrgent
        ? 'bg-red-500 text-white font-bold'
        : 'bg-[#F9B3B3] text-black font-semibold'
    }`}
            onClick={() => {
              setShowUrgent(true);
              setKeyword('');
            }}
          >
            Urgent
          </button>

          <div className="flex items-center gap-2 mr-2">
            <button
              className="rounded-full px-3 text-sm h-7 flex items-center justify-center
            transition-colors duration-200 hover:text-white hover:font-bold 
            hover:transform hover:scale-105 hover:bg-red-500
            bg-[#F9B3B3] text-black font-semibold w-[105px]"
              onClick={() => {
                setShowUrgent(false);
                setKeyword('');
                if (onClearStatus) onClearStatus();
              }}
            >
              All Requests
            </button>
          </div>
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full max-w-full rounded-lg bg-[#F9B3B3]">
            <thead className="bg-[#F76C6C]">
              <tr className="text-white text-center font-semibold h-8 text-[16px]">
                <th className="px-3 w-16 text-center whitespace-nowrap">
                  ReceiveId
                </th>
                <th className="px-3 w-40 text-left whitespace-nowrap">
                  Fullname
                </th>
                <th className="px-3 w-24 text-center whitespace-nowrap">
                  BloodType
                </th>
                <th className="px-3 w-32 text-center whitespace-nowrap">
                  Component Type
                </th>
                <th className="px-3 w-16 text-center whitespace-nowrap">
                  Quantity
                </th>
                <th className="px-3 w-16 text-center whitespace-nowrap">
                  Volume
                </th>
                <th className="px-3 w-40 text-left whitespace-nowrap">
                  Hospital Address
                </th>
                <th className="px-3 w-16 text-center whitespace-nowrap">
                  Priority
                </th>
                <th className="px-3 w-28 text-center whitespace-nowrap">
                  Require Day
                </th>
                <th className="px-3 w-16 text-center whitespace-nowrap">
                  Status
                </th>
                <th className="px-3 w-20 text-center whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center text-gray-500 py-4">
                    There's no receive request at this status.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request, idx) => (
                  <tr key={idx} className="border-[#f9b3b3]">
                    <td className="px-3 py-2 w-16 text-center">
                      {request.receiveId}
                    </td>
                    <td className="px-3 w-40 text-left">
                      {request.user?.fullName}
                    </td>
                    <td className="px-3 w-24 text-center">
                      {request.bloodType}
                    </td>
                    <td className="px-3 w-32 text-center">
                      {request.componentType}
                    </td>
                    <td className="px-3 w-16 text-center">
                      {request.quantity ?? 'Updating...'}
                    </td>
                    <td className="px-3 w-16 text-center">
                      {request.volume ?? 'Updating...'}
                    </td>
                    <td
                      className="px-3 w-40 text-left max-w-[160px] truncate cursor-pointer"
                      title={request.hospitalAddress}
                      onClick={() => handleShowModal(request.hospitalAddress)}
                    >
                      {request.hospitalAddress}
                    </td>
                    <td className="px-3 w-16 text-center">
                      {request.priority}
                    </td>
                    <td className="px-3 w-28 text-center">
                      {request.requireDate
                        ? dayjs(request.requireDate).format('DD/MM/YYYY')
                        : ''}
                    </td>
                    <td className="px-3 text-center w-16">
                      <span
                        className={`
                w-[95px]
                inline-block
                px-0 py-1
                rounded-full
                text-xs
                font-semibold
                text-center
                ${getStatusColor(request.status)}
              `}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-3 text-center w-20">
                      <span className="flex items-center justify-center gap-2">
                        <ProfileModal2 request={request} />
                        <ReceiveRequestProcessModal
                          request={request}
                          onReloadTable={triggerReloadCount}
                        />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Modal for long hospital address */}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setShowAddressModal(false)}
            ></div>
            {/* Modal content */}
            <div className="relative ml-64 bg-white p-6 rounded-lg shadow-lg max-w-lg w-full z-10 flex flex-col items-center">
              <div className="mb-4 font-bold text-center">Hospital Address</div>
              <div className="mb-4 break-words whitespace-pre-line text-center">
                {modalContent}
              </div>
              <button
                className="px-2 py-1 bg-red-400 text-white rounded hover:bg-red-600"
                onClick={() => setShowAddressModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
