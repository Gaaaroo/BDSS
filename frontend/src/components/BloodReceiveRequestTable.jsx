import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { fetchAllSeekRequests } from '../services/api/bloodRequestService';
import ProfileModal2 from './ProfileModal2';
import ReceiveRequestProcessModal from './ReceiveRequestProcessModal';
import Pagination from './Pagination';
import MySearch from './MySearch';

function getStatusColor(status) {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-400 text-white';
    case 'PROCESSING':
      return 'bg-cyan-400 text-white';
    case 'REJECTED':
      return 'bg-red-400 text-white';
    default:
      return 'bg-gray-300 text-black';
  }
}

export default function BloodReceiveRequestTable({
  selectedStatus,
  triggerReloadCount,
  onClearStatus,
}) {
  const [keyword, setKeyword] = useState('');
  const [receiveRequests, setReceiveRequests] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const [showUrgent, setShowUrgent] = useState(false);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [inputPage, setInputPage] = useState(1);

  const [sortField, setSortField] = useState('receiveId');
  const [sortDir, setSortDir] = useState('desc');

  // view all donate request and search posts by keyword
  const fetchRequests = useCallback(async () => {
    try {
      console.log('Search keyword:', keyword);
      let data = await fetchAllSeekRequests(
        keyword.trim(),
        selectedStatus,
        showUrgent ? 'Urgent' : undefined,
        sortField,
        sortDir,
        page,
        size
      );
      console.log('Fetched data:', keyword);
      setReceiveRequests(
        (data.content || []).map((request) => ({
          ...request,
          id: request.receiveId,
        }))
      );
      console.log('Posts fetched successfully', data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setReceiveRequests([]);
    }
  }, [keyword, page, size, showUrgent, selectedStatus, sortField, sortDir]);

  useEffect(() => {
    setPage(0);
    setInputPage(1);
  }, [keyword, selectedStatus, showUrgent]);

  const filteredRequests = receiveRequests;

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchRequests();
    }, 400);
    return () => clearTimeout(timeout);
  }, [selectedStatus, keyword, triggerReloadCount, page, showUrgent, sortField, sortDir]);

  // Modal handler for long hospital address
  const handleShowModal = (content) => {
    setModalContent(splitByLength(content, 50) || 'NO ADDRESS');
    setShowAddressModal(true);
  };

  function splitByLength(str, n) {
    if (!str) return '';
    return str.match(new RegExp('.{1,' + n + '}', 'g')).join('\n');
  }

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setInputPage(newPage + 1);
  };
  const handleGoToPage = () => {
    let p = Number(inputPage) - 1;
    if (p >= 0 && p < totalPages) setPage(p);
  };

  //   function insertLineBreaks(str, maxLen) {
  //   let result = '';
  //   for (let i = 0; i < str.length; i += maxLen) {
  //     result += str.slice(i, i + maxLen) + '\n';
  //   }
  //   return result;
  // }

  return (
    <div className="w-full flex justify-center items-center">
      <div
        className="overflow-hidden bg-white rounded-xl pt-5 p-3 shadow border
        w-full border-gray-200 mt-10 m-5"
      >
        {/* Search and filter */}

        <div className="flex items-center justify-between mb-4">
          <MySearch
            searchTerm={keyword}
            setSearchTerm={setKeyword}
            placeholder="Search by fullname, phone, blood type"
          />
          <div className="flex items-center gap-3">
            <select
              className="px-3 text-sm flex items-center justify-center rounded
      transition-colors duration-200 font-semibold border border-[#F9B3B3]
      focus:outline-none bg-white text-black w-[130px] h-[31px]"
              value={showUrgent ? 'Urgent' : 'All'}
              onChange={(e) => {
                const value = e.target.value;
                setShowUrgent(value === 'Urgent');
                setPage(0);
                setInputPage(1);
                setKeyword('');
                if (onClearStatus) onClearStatus();
              }}
            >
              <option value="All">All Requests</option>
              <option value="Urgent">Urgent</option>
            </select>

            <button
              className="px-3 py-1 h-[31px] bg-white text-black border border-[#F9B3B3] rounded
              flex items-center justify-center
               hover:bg-red-500 hover:text-white transition"
              onClick={() => {
                setSortField('requiredDate');
                setSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'));
                setPage(0);
                setInputPage(1);
              }}
            >
              Sort by Required Date{' '}
              {sortField === 'requiredDate'
                ? sortDir === 'desc'
                  ? '↓'
                  : '↑'
                : ''}
            </button>
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full table-auto border border-gray-300 rounded-lg">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="py-2 pl-4 text-center">#</th>
                <th className="py-2 text-center">Fullname</th>
                <th className="py-2 text-center">BloodType</th>
                <th className="py-2 text-center">Component Type</th>
                <th className="py-2 text-center">Quantity</th>
                <th className="py-2 text-center">Volume</th>
                <th className="py-2 text-center">Hospital Address</th>
                <th className="py-2 text-center">Priority</th>
                <th className="py-2 text-center">Required Day</th>
                <th className="py-2 text-center">Status</th>
                <th className="py-2 pr-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-2 text-center text-red-500">
                    There's no receive request at this status.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request, idx) => (
                  <tr key={idx} className="even:bg-red-50 odd:bg-white">
                    <td className="py-2 text-center">{idx + 1}</td>
                    <td className="py-2 text-center">
                      {request.user?.fullName}
                    </td>
                    <td className="py-2 text-center">{request.bloodType}</td>
                    <td className="py-2 text-center">
                      {request.componentType}
                    </td>
                    <td className="py-2 text-center">
                      {request.quantity ?? 'Updating...'}
                    </td>
                    <td className="py-2 text-center">
                      {request.volume ?? 'Updating...'}
                    </td>
                    <td
                      className="py-2 text-center max-w-[140px] truncate cursor-pointer"
                      title={request.hospitalAddress}
                      onClick={() => handleShowModal(request.hospitalAddress)}
                    >
                      {request.hospitalAddress}
                    </td>
                    <td className="py-2 text-center">{request.priority}</td>
                    <td className="py-2 text-center">
                      {request.requiredDate
                        ? dayjs(request.requiredDate).format(
                            'DD/MM/YYYY - HH:mm'
                          )
                        : ''}
                    </td>
                    <td className="py-2 text-center">
                      <span
                        className={`
                  w-[95px]
                  inline-block
                  px-0 py-1
                  rounded-full
                  text-xs
                  font-semibold
                  text-center
                  ${getStatusColor(request.status)}
                `}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className="flex items-center justify-center gap-2">
                        <ProfileModal2 request={request} />
                        <ReceiveRequestProcessModal
                          request={request}
                          onReloadTable={triggerReloadCount}
                        />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          inputPage={inputPage}
          setInputPage={setInputPage}
          onGoToPage={handleGoToPage}
        />
        {/* Modal for long hospital address */}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setShowAddressModal(false)}
            ></div>
            {/* Modal content */}
            <div className="relative ml-64 bg-white p-6 rounded-lg shadow-lg max-w-lg w-full z-10 flex flex-col items-center">
              <div className="mb-4 font-bold text-center">Hospital Address</div>
              <div className="mb-4 break-words whitespace-pre-line text-center">
                {modalContent}
              </div>
              <button
                className="px-2 py-1 bg-red-400 text-white rounded hover:bg-red-600"
                onClick={() => setShowAddressModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
