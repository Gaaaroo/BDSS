import React from 'react';
import { useEffect, useState } from 'react';
import {
  getAllBloodDonateRequests,
  searchBloodDonateRequests,
} from '../services/api/bloodRequestService';
import dayjs from 'dayjs';
import { BiUser, BiNote } from 'react-icons/bi';
import ProfileModal from './ProfileModal';

function getStatusColor(status) {
  switch (status) {
    case 'Approved':
      return 'bg-green-400 text-white';
    case 'Process':
      return 'bg-cyan-400 text-white';
    case 'Rejected':
      return 'bg-red-400 text-white';
    default:
      return 'bg-gray-300 text-black';
  }
}

export default function BloodRequestTable() {
  const [keyword, setKeyword] = useState('');
  const [donateRequests, setDonateRequests] = useState([]);
  

  // view all donate request and search posts by keyword
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Search keyword:', keyword);
        let data;
        if (keyword.trim() === '') {
          data = await getAllBloodDonateRequests();
          console.log('Fetching all posts:', data);
        } else {
          data = await searchBloodDonateRequests(keyword);
        }
        // setPosts(data);
        setDonateRequests(
          data.map((request) => ({
            ...request,
            id: request.donateId,
          }))
        );
        console.log('Posts fetched successfully', data);
      } catch (error) {
        if (error.response.data.code === 1015) setError('Not found posts');
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="overflow-x-auto bg-pink-300 rounded-xl p-4 mt-4">
      {/* Search and filter */}
      <div className="flex items-center justify-between mb-2">
        <input
          type="text"
          placeholder="Search"
          className="border rounded-full px-3 py-1 outline-none"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <span className="font-semibold">Filler</span>
          <button className="border rounded-full px-3 py-1 text-xs">
            Priority
          </button>
          <button className="border rounded-full px-3 py-1 text-xs">
            Priority
          </button>
        </div>
      </div>

      <div className="">
        <table className="min-w-full bg-[#F9B3B3] rounded-lg">
          <thead className="bg-[#F76C6C]">
            <tr className="text-white text-center font-semibold h-8 text-[16px]">
              <th className="px-3 w-12 text-center">RequestId</th>
              <th className="px-3 w-48 text-left">Fullname</th>
              <th className="px-3 w-10 text-center">Gender</th>
              <th className="px-3 w-30 text-center">Blood type</th>
              <th className="px-3 w-12 text-center">Volume</th>
              <th className="px-3 w-12 text-left">Phone</th>
              <th className="px-3 w-40 text-center">Request date</th>
              <th className="px-3 w-10 text-center">Status</th>
              <th className="px-3 w-15 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {donateRequests.map((request, idx) => (
              <tr key={idx} className="border-b border-[#f9b3b3] ">
                <td className="px-3 py-2 w-12 text-center">
                  {request.donateId}
                </td>
                <td className="px-3 w-48 text-left">
                  {request.userResponse.fullName}
                </td>
                <td className="px-3 w-10 text-center">
                  {request.userResponse.gender}
                </td>
                <td className="px-3 w-30 text-center">
                  {request.userResponse.bloodType}
                </td>
                <td className="px-3 w-12 text-center">
                  {request.volume ? request.volume : 'Updating...'}
                </td>
                <td className="px-3 w-12 text-left">
                  {request.userResponse.phone}
                </td>
                <td className="px-3 text-center ">
                  {dayjs(request.requestDate).format('HH:mm DD/MM/YYYY')}
                </td>
                <td className="px-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-3 text-center">
                  <span className="flex items-center justify-center gap-2">
                    {/* <button
                      title="View profile"
                      className="text-cyan-500 hover:text-cyan-700 text-2xl"
                      onClick={() => handleViewProfile(request.id)}
                    >
                      <BiUser />
                    </button> */}
                    <ProfileModal user={request.userResponse}/>
                    <button
                      title="Staff note"
                      className="text-yellow-500 hover:text-yellow-700 text-2xl"
                      onClick={() => handleStaffNote(request.id)}
                    >
                      <BiNote />
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
