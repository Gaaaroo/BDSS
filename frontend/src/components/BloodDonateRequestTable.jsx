import React from 'react';
import { useEffect, useState } from 'react';
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

export default function BloodRequestTable({ selectedStatus }) {
  const [keyword, setKeyword] = useState('');
  const [donateRequests, setDonateRequests] = useState([]);

  // view all donate request and search posts by keyword
  const fetchRequests = async () => {
    try {
      console.log('Search keyword:', keyword);
      let data;
      if (keyword.trim() === '') {
        data = await getAllBloodDonateRequests();
        console.log('Fetching all posts:', data);
      } else {
        data = await searchBloodDonateRequests(keyword);
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
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = selectedStatus
    ? donateRequests.filter((req) => req.status === selectedStatus)
    : donateRequests;

  return (
    <div className="overflow-x-auto bg-pink-300 rounded-xl p-4 mt-4">
      {/* Search and filter */}
      <div className="flex items-center justify-between mb-2">
        <input
          type="text"
          placeholder="Search"
          className="border rounded-full px-3 py-1 outline-none"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <span className="font-semibold">Filler</span>
          <button className="border rounded-full px-3 py-1 text-xs">
            Priority
          </button>
          <button className="border rounded-full px-3 py-1 text-xs">
            Priority
          </button>
        </div>
      </div>

      <div className="">
        <table className="min-w-full bg-[#F9B3B3] rounded-lg">
          <thead className="bg-[#F76C6C]">
            <tr className="text-white text-center font-semibold h-8 text-[16px]">
              <th className="px-3 w-12 text-center">RequestId</th>
              <th className="px-3 w-48 text-left">Fullname</th>
              <th className="px-3 w-10 text-center">Gender</th>
              <th className="px-3 w-30 text-center">Blood type</th>
              <th className="px-3 w-12 text-center">Volume</th>
              <th className="px-3 w-12 text-left">Phone</th>
              <th className="px-3 w-40 text-center">Request date</th>
              <th className="px-3 w-10 text-center">Status</th>
              <th className="px-3 w-15 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-gray-500 py-4">
                  There's no donation request at this status.
                </td>
              </tr>
            ) : (
              filteredRequests.map((request, idx) => (
                <tr key={idx} className="border-b border-[#f9b3b3] ">
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
                        onReloadTable={fetchRequests}
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
  );
}
