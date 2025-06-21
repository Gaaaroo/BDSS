import React from 'react';
import StatusCard from './StatusCard';
import BloodDonateRequestTable from './BloodDonateRequestTable';
import { useState } from 'react';

export default function BloodRequestDashboard() {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);

  const triggerReloadCount = () => setReloadCount((prev) => prev + 1);

  return (
    <>
      <div className="text-center text-lg font-bold text-red-500">
        Donate Blood Request Content
      </div>
      <StatusCard
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        reloadCount={reloadCount}
      />
      <BloodDonateRequestTable
        selectedStatus={selectedStatus}
        triggerReloadCount={triggerReloadCount}
        onClearStatus={() => setSelectedStatus(null)}
      />
    </>
  );
}
