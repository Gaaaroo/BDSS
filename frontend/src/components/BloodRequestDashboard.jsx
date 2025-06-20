import React from 'react';
import StatusCard from './StatusCard';
import BloodDonateRequestTable from './BloodDonateRequestTable';
import { useState } from 'react';

export default function BloodRequestDashboard() {
  
    const [selectedStatus, setSelectedStatus] = useState(null);


  return (
    <>
      <div className="text-center text-lg font-bold text-red-500">
        Donate Blood Request Content
      </div>
      <StatusCard setSelectedStatus={setSelectedStatus}/>
      <BloodDonateRequestTable selectedStatus={selectedStatus}/>
    </>
  );
}
