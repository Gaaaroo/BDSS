import React, { useState } from 'react';
import { getSuitableBloodByReceiveId } from '../services/api/bloodRequestService';
import { assignBloodUnitToReceiveForm } from '../services/api/bloodUnitService';
import { useApp } from '../Contexts/AppContext';
import MapFinder from './MapFinder';
import { toast } from 'react-toastify';

export default function FindSuitableBlood({
  receiveId,
  quantity,
  bloodReceived = [],
  onReload,
}) {
  const { profile } = useApp();
  const [openPopup, setOpenPopup] = useState(false);
  const [suitableBloodList, setSuitableBloodList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showFinder, setShowFinder] = useState(false);
  const [showAssignedBlood, setShowAssignedBlood] = useState(false);

  const fetchData = async (pageNumber = 0) => {
    setLoading(true);
    setError('');
    try {
      const res = await getSuitableBloodByReceiveId(receiveId, pageNumber, 10);
      console.log('Fetched suitable blood:', res);
      setSuitableBloodList(res.content || []);
      setTotalPages(res.totalPages || 0);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch suitable blood.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPopup = () => {
    setOpenPopup(true);
    fetchData(0); // reset về page 0 mỗi lần mở popup
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setPage(0);
    setSuitableBloodList([]);
    if (onReload) onReload();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      fetchData(newPage);
    }
  };

  const assignedCount = suitableBloodList.filter(
    (blood) => blood.status === 'Used'
  ).length;

  const handleAssign = async (blood, index) => {
    if (assignedCount >= quantity) {
      toast.warning(`You must assign exactly ${quantity} blood unit(s).`);
      return;
    }

    const componentType = blood.componentType || 'whole';
    const bloodId =
      componentType === 'whole' ? blood.bloodId : blood.componentId;

    const confirmAssign = window.confirm(
      'Are you sure you want to assign this blood unit?'
    );
    if (!confirmAssign) return;

    try {
      await assignBloodUnitToReceiveForm({
        bloodId,
        receiveId,
        componentType,
      });

      const updatedList = [...suitableBloodList];
      updatedList[index] = { ...blood, status: 'Used' };
      setSuitableBloodList(updatedList);

      toast.success('Assigned successfully!');
      if (onReload) onReload();
    } catch (error) {
      toast.error('Failed to assign blood unit.');
      console.error(error);
    }
  };

  return (
    <>
      {(bloodReceived?.length ?? 0) < quantity ? (
        <button
          className="mt-4 px-3 py-2 hover:bg-text-red-600 bg-[#F76C6C] hover:scale-105 transition-transform duration-200 hover:text-white text-white rounded-[50px] font-semibold block mx-auto"
          onClick={handleOpenPopup}
        >
          Find Blood From Inventory
        </button>
      ) : (
        <button
          className="mt-4 px-3 py-2 hover:bg-red-500 bg-red-400 hover:scale-105 transition-transform duration-200 hover:text-white text-white rounded-[50px] font-semibold block mx-auto"
          onClick={() => setShowAssignedBlood(true)}
        >
          View Assigned Blood
        </button>
      )}

      {openPopup && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[70%] max-w-[1600px] h-[700px] overflow-y-auto relative transform translate-x-[120px]">
            <button
              className="absolute top-4 right-6 text-gray-500 hover:text-red-500 text-2xl"
              onClick={handleClosePopup}
            >
              ×
            </button>

            <h2 className="text-4xl font-bold mt-8 mb-2 text-center text-red-600">
              Suitable Blood Units
            </h2>
            <p className="text-center text-gray-700 text-lg mb-6">
              Need to assign: <span className="font-bold">{quantity}</span>{' '}
              unit(s). Already assigned:{' '}
              <span className="font-bold">{assignedCount}</span>
            </p>

            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : suitableBloodList.length === 0 ||
              suitableBloodList.length < quantity ? (
              <div className="text-center mt-6">
                <p className="text-gray-500 text-lg mb-4">
                  No suitable blood found.
                </p>
                <button
                  onClick={() => setShowFinder(true)}
                  className="mx-auto flex items-center justify-center bg-red-500 hover:bg-red-400 text-white font-semibold px-4 py-2 rounded-full transition"
                >
                  {/* icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 22s8-6.5 8-13a8 8 0 10-16 0c0 6.5 8 13 8 13z"
                    />
                  </svg>
                  Find Blood Donors Near You
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse text-sm">
                    <thead>
                      <tr className="bg-red-700 text-white">
                        <th className="px-3 py-2 border">No.</th>
                        <th className="px-3 py-2 border">Full Name</th>
                        <th className="px-3 py-2 border">Blood Type</th>
                        <th className="px-3 py-2 border">Component Type</th>
                        <th className="px-3 py-2 border">Volume</th>
                        <th className="px-3 py-2 border">Status</th>
                        <th className="px-3 py-2 border">Donate Date</th>
                        <th className="px-3 py-2 border">Expiry Date</th>
                        <th className="px-3 py-2 border">Note</th>
                        <th className="px-3 py-2 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suitableBloodList.map((blood, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? 'bg-white' : 'bg-red-50'}
                        >
                          <td className="border px-2 py-1 text-center">
                            {page * 10 + index + 1}
                          </td>
                          <td className="border px-2 py-1">
                            {blood.userResponse?.fullName}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {blood.bloodType}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {blood.componentType || 'Whole'}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {blood.volume}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {blood.status}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {blood.donatedDate?.slice(0, 10)}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {blood.expiryDate?.slice(0, 10)}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {blood.note}
                          </td>
                          <td className="border px-2 py-1 text-center space-x-1">
                            {blood.status === 'Used' ? (
                              <button
                                disabled
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm cursor-not-allowed"
                              >
                                Assigned
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAssign(blood, index)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Assign
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="mt-4 flex justify-center items-center gap-4">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 rounded"
                  >
                    Previous
                  </button>
                  <span>
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page + 1 >= totalPages}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 rounded"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showAssignedBlood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay mờ */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowAssignedBlood(false)}
          ></div>

          {/* Nội dung chính */}
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[1000px] z-10 overflow-auto h-[70vh] ml-64">
            <h3 className="text-3xl font-bold text-red-600 mb-6 text-center mt-15">
              Assigned Blood Units
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-300 rounded-lg shadow-md">
                <thead className="bg-white text-sm font-bold border-b border-gray-300">
                  <tr>
                    <th className="py-6 px-4 border border-gray-300 text-red-600">
                      #
                    </th>
                    <th className="py-6 px-4 border border-gray-300 text-red-600 text-left">
                      Donor Name
                    </th>
                    <th className="py-6 px-4 border border-gray-300 text-red-600 text-left">
                      Phone
                    </th>
                    <th className="py-6 px-4 border border-gray-300 text-red-600 text-left">
                      Email
                    </th>
                    <th className="py-6 px-4 border border-gray-300 text-red-600 text-left">
                      Blood Type
                    </th>
                    <th className="py-6 px-4 border border-gray-300 text-red-600 text-left">
                      Volume
                    </th>
                    <th className="py-6 px-4 border border-gray-300 text-red-600 text-left">
                      Status
                    </th>
                    <th className="py-6 px-4 border border-gray-300 text-red-600 text-left">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {bloodReceived.map((blood, index) => (
                    <tr key={index} className="hover:bg-red-50 transition">
                      <td className="py-6 px-4 border border-gray-300 text-center">
                        {index + 1}
                      </td>
                      <td className="py-6 px-4 border border-gray-300">
                        {blood.userResponse?.fullName}
                      </td>
                      <td className="py-6 px-4 border border-gray-300">
                        {blood.userResponse?.phone}
                      </td>
                      <td className="py-6 px-4 border border-gray-300">
                        {blood.userResponse?.email}
                      </td>
                      <td className="py-6 px-4 border border-gray-300">
                        {blood.bloodType}
                      </td>
                      <td className="py-6 px-4 border border-gray-300">
                        {blood.volume} ml
                      </td>
                      <td className="py-6 px-4 border border-gray-300">
                        {blood.status}
                      </td>
                      <td className="py-6 px-4 border border-gray-300">
                        {blood.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center mt-6">
              <button
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold"
                onClick={() => setShowAssignedBlood(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showFinder && (
        <MapFinder
          initialLocation={{
            lat: profile?.lat,
            lng: profile?.lng,
          }}
          onClose={() => setShowFinder(false)}
        />
      )}
    </>
  );
}
