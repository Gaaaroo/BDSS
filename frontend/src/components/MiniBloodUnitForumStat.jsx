import React, { useEffect, useState } from 'react';
import { countStoredBloodUnit } from '../services/api/inventoryService';

export default function MiniForumStatProps({ reload }) {
  const [bloodStats, setBloodStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await countStoredBloodUnit();
        setBloodStats(response || {});
        console.log('Forum stats fetched successfully:', response);
      } catch (err) {
        console.error('Error fetching forum stats:', err);
      }
    };
    fetchStats();
  }, [reload]);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <>
      <div className="text-center py-4 bg-white text-[#F76C6C] font-semibold tracking-wide shadow flex justify-center gap-8">
        {bloodTypes.map((type) => (
          <div
            key={type}
            className="flex flex-row items-center justify-center gap-1 px-3 py-2 border rounded-lg bg-[#FDE4E4] w-[100px]"
          >
            <span className="font-bold text-[#F76C6C] text-lg">{type} :</span> 
            <span className="text-black text-base ml-1">
              {bloodStats[type] ?? 0}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
