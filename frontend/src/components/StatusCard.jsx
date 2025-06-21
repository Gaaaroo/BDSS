import React, { useState, useEffect } from 'react';
import { countDonateRequestByStatus } from '../services/api/bloodRequestService';

export default function StatusCard({
  setSelectedStatus,
  selectedStatus,
  reloadCount,
}) {
  const [statusCount, setStatusCount] = useState();

  useEffect(() => {
    const fetchCount = async () => {
      const data = await countDonateRequestByStatus();
      setStatusCount(data);
    };
    fetchCount().catch((error) => {
      console.error('Error fetching status count:', error);
    });
  }, [reloadCount]);

  if (!statusCount) return <div>Loading...</div>;

  return (
    <div className="flex gap-8 mt-8 justify-center items-center">
      <div
        className={`bg-[#F9B3B3] rounded-lg px-8 py-4 flex flex-col items-center shadow cursor-pointer
                  hover:transform hover:scale-105 transition-transform duration-300
          ${
            selectedStatus === 'PENDING'
              ? 'ring-2 ring-red-400 border-1 border-red-400'
              : ''
          }
        `}
        onClick={() => setSelectedStatus('PENDING')}
      >
        <span className="text-2xl font-bold text-yellow-600">
          {statusCount.PENDING || 0}
        </span>
        <span className="text-white font-medium">Pending Request</span>
      </div>
      <div
        className={`bg-[#F9B3B3] rounded-lg px-8 py-4 flex flex-col items-center shadow cursor-pointer
                    hover:transform hover:scale-105 transition-transform duration-300
          ${
            selectedStatus === 'PROCESSING'
              ? 'ring-2 ring-red-400 border-1 border-red-400'
              : ''
          }
        `}
        onClick={() => setSelectedStatus('PROCESSING')}
      >
        <span className="text-2xl font-bold text-cyan-500">
          {statusCount.PROCESSING || 0}
        </span>
        <span className="text-white font-medium">Processing Request</span>
      </div>
      <div
        className={`bg-[#F9B3B3] rounded-lg px-8 py-4 flex flex-col items-center shadow cursor-pointer
                    hover:transform hover:scale-105 transition-transform duration-300
          ${
            selectedStatus === 'APPROVED'
              ? 'ring-2 ring-red-400 border-1 border-red-400'
              : ''
          }
        `}
        onClick={() => setSelectedStatus('APPROVED')}
      >
        <span className="text-2xl font-bold text-green-500">
          {statusCount.APPROVED || 0}
        </span>
        <span className="text-white font-medium">Approved Request</span>
      </div>
      <div
        className={`bg-[#F9B3B3] rounded-lg px-8 py-4 flex flex-col items-center shadow cursor-pointer
          hover:transform hover:scale-105 transition-transform duration-300
          ${
            selectedStatus === 'CANCELLED'
              ? 'ring-2 ring-red-400 border-1 border-red-400'
              : ''
          }
        `}
        onClick={() => setSelectedStatus('CANCELLED')}
      >
        <span className="text-2xl font-bold text-red-600">
          {statusCount.CANCELLED || 0}
        </span>
        <span className="text-white font-medium">Cancelled Request</span>
      </div>
    </div>
  );
}
