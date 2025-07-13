import React, { useState } from 'react';
import { getSuitableBloodByReceiveId } from '../services/api/bloodRequestService';
import { assignBloodUnitToReceiveForm } from '../services/api/bloodUnitService';

export default function FindSuitableBlood({ receiveId }) {
  const [openPopup, setOpenPopup] = useState(false);
  const [suitableBloodList, setSuitableBloodList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async (pageNumber = 0) => {
    setLoading(true);
    setError('');
    try {
      const res = await getSuitableBloodByReceiveId(receiveId, pageNumber, 10);
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
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      fetchData(newPage);
    }
  };

  const handleAssign = async (blood, index) => {
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

      // Không fetch lại, chỉ cập nhật local state
      const updatedList = [...suitableBloodList];
      updatedList[index] = { ...blood, status: 'Used' };
      setSuitableBloodList(updatedList);

      alert('Assigned successfully!');
    } catch (error) {
      alert('Failed to assign blood unit.');
      console.error(error);
    }
  };

  return (
    <>
      <button
        className="mt-4 px-4 py-6 hover:bg-red-600 bg-[#F76C6C] hover:scale-105 transition-transform duration-200 text-white rounded-full font-semibold block mx-auto"
        onClick={handleOpenPopup}
      >
        Find Blood From Inventory
      </button>

      {openPopup && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-[1600px] h-[700px] overflow-y-auto relative transform translate-x-[120px]">
            <button
              className="absolute top-4 right-6 text-gray-500 hover:text-red-500 text-2xl"
              onClick={handleClosePopup}
            >
              ×
            </button>

            <h2 className="text-4xl font-bold mt-8 mb-6 text-center text-red-600">
              Suitable Blood Units
            </h2>

            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : suitableBloodList.length === 0 ? (
              <p className="text-center text-gray-500">
                No suitable blood found.
              </p>
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
                        <th className="px-3 py-2 border">Created Date</th>
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
                            {blood.createdDate?.slice(0, 10)}
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
    </>
  );
}
