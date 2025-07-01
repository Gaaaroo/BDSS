import StatusCard from './StatusCard';
import BloodDonateRequestTable from './BloodDonateRequestTable';
import { useState } from 'react';
import { countDonateRequestByStatus } from '../services/api/bloodRequestService';

export default function BloodRequestDashboard() {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);

  const triggerReloadCount = () => setReloadCount((prev) => prev + 1);

  return (
    <>
      <div className="text-center text-3xl font-bold text-red-500">
        Donate Blood Request
      </div>
      <StatusCard
        key="donate"
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        reloadCount={reloadCount}
        fetchStatusCount={countDonateRequestByStatus}
      />
      <BloodDonateRequestTable
        selectedStatus={selectedStatus}
        triggerReloadCount={triggerReloadCount}
        onClearStatus={() => setSelectedStatus(null)}
      />
    </>
  );
}
