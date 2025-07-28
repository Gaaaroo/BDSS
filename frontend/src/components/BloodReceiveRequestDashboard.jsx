import BloodReceiveRequestTable from './BloodReceiveRequestTable';
import StatusCard from './StatusCard';
import {
  countReceiveRequestByStatus,
} from '../services/api/bloodRequestService';
import { useState, useEffect } from 'react';

const receiveStatuses = [
  { key: 'PENDING', label: 'Pending Request', color: 'text-yellow-600' },
  { key: 'PROCESSING', label: 'Processing Request', color: 'text-cyan-500' },
  { key: 'APPROVED', label: 'Approved Request', color: 'text-green-500' },
  { key: 'CANCELLED', label: 'Cancelled Request', color: 'text-red-600' },
];

export default function BloodReceiveRequestDashboard() {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);

  const triggerReloadCount = () => setReloadCount((prev) => prev + 1);

  return (
    <>
      <div className="text-center text-2xl font-bold text-red-500 mb-5">
        Receive Blood Request
      </div>
      <StatusCard
        key="receive"
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        reloadCount={reloadCount}
        fetchStatusCount={countReceiveRequestByStatus}
        statuses={receiveStatuses}
      />
      <BloodReceiveRequestTable
        selectedStatus={selectedStatus}
        triggerReloadCount={triggerReloadCount}
        onClearStatus={() => setSelectedStatus(null)}
      />
    </>
  );
}
