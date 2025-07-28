import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { fetchAllRequests } from '../services/api/bloodRequestService';
import dayjs from 'dayjs';
import ProfileModal from './ProfileModal';
import DonateRequestProcessPanel from './DonateRequestProcessModal';
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

export default function BloodRequestTable({
  selectedStatus,
  triggerReloadCount,
  onClearStatus,
}) {
  const [keyword, setKeyword] = useState('');
  const [donateRequests, setDonateRequests] = useState([]);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [inputPage, setInputPage] = useState(1);

  // view all donate request and search posts by keyword
  const fetchRequests = useCallback(async () => {
    try {
      console.log('Search keyword:', keyword);
      const data = await fetchAllRequests(
        keyword.trim(),
        selectedStatus,
        page,
        size
      );
      // setDonateRequests(
      //   data.map((request) => ({
      //     ...request,
      //     id: request.donateId,
      //   }))
      // );
      console.log({ keyword, selectedStatus, page, size });
      setDonateRequests(
        (data.content || []).map((request) => ({
          ...request,
          id: request.donateId,
        }))
      );
      console.log('Posts fetched successfully', data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setDonateRequests([]);
    }
  }, [keyword, page, size, selectedStatus]);

  useEffect(() => {
    setPage(0);
    setInputPage(1);
  }, [keyword, selectedStatus]);

  // Fetch all requests on initial load
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchRequests();
    }, 400); // Debounce search input by 400ms
    return () => clearTimeout(timeout);
  }, [selectedStatus, keyword, triggerReloadCount, page]);

  const filteredRequests = donateRequests;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setInputPage(newPage + 1);
  };
  const handleGoToPage = () => {
    let p = Number(inputPage) - 1;
    if (p >= 0 && p < totalPages) setPage(p);
  };

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
          <div className="flex items-center gap-2 mr-2">
            <button
              className="rounded-full px-3 text-sm h-7 flex items-center justify-center
            transition-colors duration-200 hover:text-white hover:font-bold 
            hover:transform hover:scale-105 hover:bg-red-500
            bg-[#F9B3B3] text-black font-semibold"
              onClick={() => {
                setKeyword('');
                if (onClearStatus) onClearStatus();
                setPage(0);
                setInputPage(1);
              }}
            >
              All Requests
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 rounded-lg">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="py-2 text-center">No.</th>
                <th className="py-2 text-center">Full Name</th>
                <th className="py-2 text-center">Gender</th>
                <th className="py-2 text-center">Blood Type</th>
                <th className="py-2 text-center">Volume</th>
                <th className="py-2 text-center">Phone</th>
                <th className="py-2 text-center">Request Date</th>
                <th className="py-2 text-center">Ready Date</th>
                <th className="py-2 text-center">Status</th>
                <th className="py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-2 text-center text-red-500">
                    There's no donation request at this status.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request, idx) => (
                  <tr
                    key={request.donateId || idx}
                    className="even:bg-red-50 odd:bg-white"
                  >
                    <td className="py-2 text-center">{idx + 1}</td>
                    <td className="py-2 text-center">
                      {request.userResponse.fullName}
                    </td>
                    <td className="py-2 text-center">
                      {request.userResponse.gender}
                    </td>
                    <td className="py-2 text-center">
                      {request.userResponse.bloodType}
                    </td>
                    <td className="py-2 text-center">
                      {request.bloodUnitResponse?.volume
                        ? request.bloodUnitResponse.volume
                        : 'Updating...'}
                    </td>
                    <td className="py-2 text-center">
                      {request.userResponse.phone}
                    </td>
                    <td className="py-2 text-center">
                      {dayjs(request.requestDate).format('HH:mm DD/MM/YYYY')}
                    </td>
                    <td className="py-2 text-center">
                      {dayjs(request.readyDate).format('HH:mm DD/MM/YYYY')}
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
                    <td className="py-2 text-center space-x-1">
                      <span className="flex items-center justify-center gap-2">
                        <ProfileModal user={request} />
                        <DonateRequestProcessPanel
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
      </div>
    </div>
  );
}
