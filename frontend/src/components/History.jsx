import React, { useEffect, useState } from 'react';
import {
  donateHistory,
  receiveHistory,
} from '../services/api/bloodFormService';
export default function History() {
  // History ===>> Blood Donation / Blood Reception
  const [donateData, setDonateData] = useState([]);
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [donateRes, receiveRes] = await Promise.all([
          donateHistory(),
          receiveHistory(),
        ]);
        setDonateData(donateRes);
        setReceiveData(receiveRes);
      } catch (error) {
        console.error('Detail error history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);
  if (loading) {
    return (
      <div className="px-8 py-10 text-center text-gray-600 text-lg animate-pulse">
        Loading Data History ...
      </div>
    );
  }
  return (
    <div className="px-8">
      <h1 className="text-xl font-bold mb-4">Blood Donation History</h1>
      <table className="mb-6 w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">No.</th>
            <th className="px-4 py-2">Fullname</th>
            <th className="px-4 py-2">Gender</th>
            <th className="px-4 py-2">Date of Birth</th>
            <th className="px-4 py-2">Blood type</th>
            <th className="px-4 py-2">Health note</th>
            <th className="px-4 py-2">Request date</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {donateData && donateData.length > 0 ? (
            donateData.map((item, idx) => (
              <tr key={idx} className="even:bg-rose-100 text-center">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{item.userResponse.fullName}</td>
                <td className="px-4 py-2">{item.userResponse.gender}</td>
                <td className="px-4 py-2">{item.userResponse.dob}</td>
                <td className="px-4 py-2">{item.userResponse.bloodType}</td>
                <td className="px-4 py-2">{item.healthNotes}</td>
                <td className="px-4 py-2">{item.requestDate}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold
      ${
        item.status === 'PENDING'
          ? 'bg-yellow-200 text-yellow-800'
          : item.status === 'APPROVED'
          ? 'bg-green-200 text-green-800'
          : item.status === 'REJECTED'
          ? 'bg-red-300 text-red-800'
          : 'bg-gray-200 text-gray-800'
      }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-2 text-gray-500">
                No information
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h1 className="text-xl font-bold mb-4">Blood Reception History</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">No.</th>
            <th className="px-4 py-2">Fullname</th>
            <th className="px-4 py-2">Blood type request</th>
            <th className="px-4 py-2">Component type</th>
            <th className="px-4 py-2">Volume</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Priority</th>
            <th className="px-4 py-2">Hospital address</th>
            <th className="px-4 py-2">Request date</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {receiveData && receiveData.length > 0 ? (
            receiveData.map((item, idx) => (
              <tr key={idx} className="even:bg-rose-100 text-center">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{item.user.fullName}</td>
                <td className="px-4 py-2">{item.bloodType}</td>
                <td className="px-4 py-2">{item.componentType}</td>
                <td className="px-4 py-2">{item.volume}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">{item.priority}</td>
                <td className="px-4 py-2">{item.hospitalAddress}</td>
                <td className="px-4 py-2">{item.requestDate}</td>
                <td className="px-4 py-2">
                  {' '}
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold
      ${
        item.status === 'PENDING'
          ? 'bg-yellow-200 text-yellow-800'
          : item.status === 'APPROVED'
          ? 'bg-green-200 text-green-800'
          : item.status === 'REJECTED'
          ? 'bg-red-200 text-red-800'
          : 'bg-gray-200 text-gray-800'
      }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center py-2 text-gray-500">
                No information
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
