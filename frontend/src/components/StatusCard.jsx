import React, { useState, useEffect } from 'react';
import {
  countDonateRequestByStatus,
  getDonateRequestByStatus,
} from '../services/api/bloodRequestService';

export default function StatusCard({ setSelectedStatus }) {
  const [statusCount, setStatusCount] = useState();
  const [requestsByStatus, setRequestsByStatus] = useState([]);

  useEffect(() => {
    const fetchCount = async () => {
      const data = await countDonateRequestByStatus();
      setStatusCount(data);
    };
    fetchCount().catch((error) => {
      console.error('Error fetching status count:', error);
    });
  }, []);

  if (!statusCount) return <div>Loading...</div>;

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    try {
      const data = getDonateRequestByStatus(status);
      setRequestsByStatus(data);
      console.log('Requests by status:', data);
    } catch (error) {
      console.error('Error fetching requests by status:', error);
    }
  };

  return (
    <>
      <div className="flex gap-8 mt-8 justify-center items-center">
        <div
          className="bg-[#F9B3B3] rounded-lg px-8 py-4 flex flex-col items-center shadow cursor-pointer"
          onClick={() => handleStatusClick('PENDING')}
        >
          <span className="text-2xl font-bold text-yellow-600">
            {statusCount.PENDING || 0}
          </span>
          <span className="text-white font-medium">Pending Request</span>
        </div>
        <div
          className="bg-[#F9B3B3] rounded-lg px-8 py-4 flex flex-col items-center shadow cursor-pointer"
          onClick={() => handleStatusClick('PROCESSING')}
        >
          <span className="text-2xl font-bold text-cyan-500">
            {statusCount.PROCESSING || 0}
          </span>
          <span className="text-white font-medium">Processing Request</span>
        </div>
        <div
          className="bg-[#F9B3B3] rounded-lg px-8 py-4 flex flex-col items-center shadow cursor-pointer"
          onClick={() => handleStatusClick('APPROVED')}
        >
          <span className="text-2xl font-bold text-green-500">
            {statusCount.APPROVED || 0}
          </span>
          <span className="text-white font-medium">Approved Request</span>
        </div>
        <div
          className="bg-[#F9B3B3] rounded-lg px-8 py-4 flex flex-col items-center shadow cursor-pointer"
          onClick={() => handleStatusClick('CANCELLED')}
        >
          <span className="text-2xl font-bold text-red-600">
            {statusCount.CANCELLED || 0}
          </span>
          <span className="text-white font-medium">Cancelled Request</span>
        </div>
      </div>
    </>
  );
}
