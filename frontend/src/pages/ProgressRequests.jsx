import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { myDonate, myReceive } from '../services/api/bloodFormService';

export default function ProgressRequests({ activeTab }) {
  const [listDonate, setListDonate] = useState([]);
  const [listReceive, setListReceive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listDonateByActiveTab, setListDonateByActiveTab] = useState([]);
  const [listReceiveByActiveTab, setListReceiveByActiveTab] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchDetail = async () => {
    try {
      const [donateRes, receiveRes] = await Promise.all([
        myDonate(),
        myReceive(),
      ]);
      setListDonate(donateRes);
      console.log('D:', donateRes);
      setListReceive(receiveRes);
      console.log('R:', receiveRes);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      if (location.state?.refresh) {
        navigate('.', { replace: true }); // xóa state sau khi dùng
      }
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [location.state]);

  useEffect(() => {
    if (!activeTab) return;
    console.log('name Tab:', activeTab);
    setListDonateByActiveTab(
      listDonate.filter((item) => item.status === activeTab)
    );
    setListReceiveByActiveTab(
      listReceive.filter((item) => item.status === activeTab)
    );
  }, [activeTab, listDonate, listReceive]);

  if (loading) return <div className="p-4">Loading data...</div>;
  if (
    !listDonate ||
    listDonate.length === 0 ||
    !listReceive ||
    listReceive.length === 0
  )
    return <div className="p-4 text-red-600">No pending requests found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-7 p-10 pt-5">
      {/*DONOR LIST */}
      <div>
        <h2 className="text-2xl font-bold text-red-600 mb-3">
          Blood Donation List
        </h2>
        {listDonateByActiveTab.length > 0 ? (
          listDonateByActiveTab.map((item, idx) => (
            <div
              key={idx}
              className="p-3 mb-3 bg-red-50 border border-red-200 rounded-xl shadow"
            >
              <div className="flex justify-between">
                <div className="font-semibold text-red-800">
                  Donor Form #ID: {item.donateId}
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-semibold
      ${
        item.status === 'PENDING'
          ? 'bg-yellow-200 text-yellow-800'
          : item.status === 'APPROVED'
          ? 'bg-green-200 text-green-800'
          : item.status === 'REJECTED'
          ? 'bg-red-300 text-red-800'
          : 'bg-blue-200 text-blue-800'
      }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Blood type: {item.userResponse.bloodType} | Request date:
                {item.requestDate.slice(0, 10)}
              </div>
              <button
                className="border px-3 py-1 text-white bg-red-700 rounded-md mt-3"
                onClick={() =>
                  navigate(`/my-activity/donation-detail/${item.donateId}`)
                }
              >
                Detail
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No blood donations</div>
        )}
      </div>

      {/* RECEIVE LIST */}
      <div>
        <h2 className="text-2xl font-bold text-blue-600 mb-3">
          Blood Receive List
        </h2>
        {listReceiveByActiveTab.length > 0 ? (
          listReceiveByActiveTab.map((item, idx) => (
            <div
              key={idx}
              className="p-3 mb-3 bg-blue-50 border border-blue-200 rounded-xl shadow"
            >
              <div className="flex justify-between">
                <div className="font-semibold text-blue-800">
                  Receive Form #{item.receiveId}
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-semibold
      ${
        item.status === 'PENDING'
          ? 'bg-yellow-200 text-orange-800'
          : item.status === 'APPROVED'
          ? 'bg-green-200 text-green-800'
          : item.status === 'REJECTED'
          ? 'bg-red-300 text-red-800'
          : 'bg-blue-200 text-blue-800'
      }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Blood type request: {item.bloodType} | Component request:{' '}
                {item.componentType} | Priority: {item.priority} | Request date:
                {item.requestDate.slice(0, 10)}
              </div>
              <button
                className="border px-3 py-1 text-white bg-blue-700 rounded-md mt-3"
                onClick={() =>
                  navigate(`/my-activity/receive-detail/${item.receiveId}`)
                }
              >
                Detail
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No blood Receptions</div>
        )}
      </div>
    </div>
  );
}
