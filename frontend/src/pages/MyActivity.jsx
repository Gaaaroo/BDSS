import React from 'react';
import Navbar from '../components/Navbar';
import img from '../assets/images/cover-photo.jpg';
import ProgressRequests from './ProgressRequests';

export function BannerMyActivity() {
  return (
    <div>
      <img src={img} alt="banner" className="w-full h-40 object-cover " />
    </div>
  );
}

export default function MyActivity() {
  // History ===>> Blood Donation / Blood Reception
  // Donation Request Blood Progress
  // Reception Request Blood Progress

  const [activeTab, setActiveTab] = React.useState('');
  const STATUS = {
    pending: 'PENDING',
    progressing: 'PROCESSING',
    approve: 'APPROVED',
    rejected: 'REJECTED',
  };
  return (
    <div>
      <Navbar mode="" />
      <BannerMyActivity />
      <div className="flex justify-start h-12">
        <button
          className={`px-6 py-2 transition text-2xl font-bold ${
            activeTab === STATUS.pending
              ? 'border-b-3 border-yellow-500 text-yellow-700 hover:bg-gray-100'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab(STATUS.pending)}
        >
          Pending
        </button>
        <button
          className={`px-6 py-2 transition text-2xl font-bold ${
            activeTab === STATUS.progressing
              ? 'border-b-3 border-blue-500 text-blue-700 hover:bg-gray-100'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab(STATUS.progressing)}
        >
          Progressing
        </button>
        <button
          className={`px-6 py-2 transition text-2xl font-bold ${
            activeTab === STATUS.approve
              ? 'border-b-3 border-green-500 text-green-700 hover:bg-gray-100'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab(STATUS.approve)}
        >
          Approved
        </button>

        <button
          className={`px-6 py-2 transition text-2xl font-bold ${
            activeTab === STATUS.rejected
              ? 'border-b-3 border-red-500 text-red-700 hover:bg-gray-100'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab(STATUS.rejected)}
        >
          Rejected
        </button>
      </div>
      <div>
        <ProgressRequests activeTab={activeTab} />
      </div>
    </div>
  );
}
