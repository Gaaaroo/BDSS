import React, { useState, useEffect } from 'react';
import LoadingPage from './LoadingPage';

export default function StatusCard({
  setSelectedStatus,
  selectedStatus,
  reloadCount,
  fetchStatusCount,
}) {
  const [statusCount, setStatusCount] = useState();

  useEffect(() => {
    const fetchCount = async () => {
      const data = await fetchStatusCount();
      setStatusCount(data);
      console.log('Status Count:', data);
    };
    fetchCount().catch((error) => {
      console.error('Error fetching status count:', error);
    });
  }, [reloadCount]);

  if (!statusCount) return <LoadingPage />;

  return (
    <div className="flex gap-8 justify-center items-center">
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
            selectedStatus === 'REJECTED'
              ? 'ring-2 ring-red-400 border-1 border-red-400'
              : ''
          }
        `}
        onClick={() => setSelectedStatus('REJECTED')}
      >
        <span className="text-2xl font-bold text-red-600">
          {statusCount.REJECTED || 0}
        </span>
        <span className="text-white font-medium">Rejected Request</span>
      </div>
    </div>
  );
}
