import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import {
  getAllBloodDonateRequests,
  searchBloodDonateRequests,
} from '../services/api/bloodRequestService';
import dayjs from 'dayjs';
import ProfileModal from './ProfileModal';
import DonateRequestProcessPanel from './DonateRequestProcessModal';

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

export default function BloodRequestTable({
  selectedStatus,
  triggerReloadCount,
  onClearStatus,
}) {
  const [keyword, setKeyword] = useState('');
  const [donateRequests, setDonateRequests] = useState([]);

  // view all donate request and search posts by keyword
  const fetchRequests = useCallback(async () => {
    try {
      console.log('Search keyword:', keyword);
      let data;
      if (keyword.trim() === '') {
        data = await getAllBloodDonateRequests();
        console.log('Fetching all posts:', data);
      } else {
        data = await searchBloodDonateRequests(keyword.trim());
      }
      setDonateRequests(
        data.map((request) => ({
          ...request,
          id: request.donateId,
        }))
      );
      console.log('Posts fetched successfully', data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setDonateRequests([]);
    }
  }, [keyword]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests, triggerReloadCount]);

  const filteredRequests = selectedStatus
    ? donateRequests.filter((req) => req.status === selectedStatus)
    : donateRequests;

  return (
    <div className="w-full flex justify-center items-center">
      <div className="overflow-hidden bg-white rounded-xl pt-5 p-3 shadow border
       w-full border-gray-200 mt-10 m-5">
        {/* Search and filter */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search by fullname, phone"
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
          <div className="flex items-center gap-2 mr-2">
            <button
              className="rounded-full px-3 text-sm h-7 flex items-center justify-center
            transition-colors duration-200 hover:text-white hover:font-bold 
            hover:transform hover:scale-105 hover:bg-red-500
            bg-[#F9B3B3] text-black font-semibold"
              onClick={() => {
                setKeyword('');
                if (onClearStatus) onClearStatus();
              }}
            >
              All Requests
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg bg-[#F9B3B3]">
            <thead className="bg-[#F76C6C]">
              <tr className="text-white text-center font-semibold h-8 text-[16px]">
                <th className="px-3 w-12 text-center whitespace-nowrap">RequestId</th>
                <th className="px-3 w-48 text-left whitespace-nowrap">Fullname</th>
                <th className="px-3 w-10 text-center whitespace-nowrap">Gender</th>
                <th className="px-3 w-30 text-center whitespace-nowrap">Blood type</th>
                <th className="px-3 w-12 text-center whitespace-nowrap">Volume</th>
                <th className="px-3 w-12 text-left whitespace-nowrap">Phone</th>
                <th className="px-3 w-40 text-center whitespace-nowrap">Request date</th>
                <th className="px-3 w-10 text-center whitespace-nowrap">Status</th>
                <th className="px-3 w-15 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center text-gray-500 py-4">
                    There's no donation request at this status.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request, idx) => (
                  <tr key={idx} className=" border-[#f9b3b3] ">
                    <td className="px-3 py-2 w-12 text-center">
                      {request.donateId}
                    </td>
                    <td className="px-3 w-48 text-left">
                      {request.userResponse.fullName}
                    </td>
                    <td className="px-3 w-10 text-center">
                      {request.userResponse.gender}
                    </td>
                    <td className="px-3 w-30 text-center">
                      {request.userResponse.bloodType}
                    </td>
                    <td className="px-3 w-12 text-center">
                      {request.volume ? request.volume : 'Updating...'}
                    </td>
                    <td className="px-3 w-12 text-left">
                      {request.userResponse.phone}
                    </td>
                    <td className="px-3 text-center ">
                      {dayjs(request.requestDate).format('HH:mm DD/MM/YYYY')}
                    </td>
                    <td className="px-3 text-center w-[95px]">
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
                    <td className="px-3 text-center">
                      <span className="flex items-center justify-center gap-2">
                        {/* Open profile modal */}
                        <ProfileModal user={request} />
                        {/* Open process modal */}
                        <DonateRequestProcessPanel
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
      </div>
    </div>
  );
}
