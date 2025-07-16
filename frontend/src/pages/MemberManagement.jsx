import React, { useEffect, useState } from 'react';
import {
  getAllUserProfile,
  countAllUsers,
  banUser,
} from '../services/api/userService';
import MySearch from '../components/MySearch';
import MemberDetail from '../components/MemberDetail';
import Pagination from '../components/Pagination';
import { toast } from 'react-toastify';

export default function MemberManagement() {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  //Modal
  const [selectedItem, setSelectedItem] = useState(null);
  // Pagination states
  const [page, setPage] = useState(0); // backend dùng page bắt đầu từ 0
  const [totalPages, setTotalPages] = useState(0);
  const [inputPage, setInputPage] = useState('');

  const [totalUsers, setTotalUsers] = useState(0);

  const handleGoToPage = () => {
    const goTo = parseInt(inputPage);
    if (!isNaN(goTo) && goTo >= 1 && goTo <= totalPages) {
      setPage(goTo - 1);
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await banUser(userId);
      toast.success('User banned successfully!');
      // Sau khi ban xong thì refetch lại danh sách
      const res = await getAllUserProfile(page, 12, searchTerm);
      setUserList(res.content);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to ban user:', err);
      toast.error('Failed to ban user');
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUserProfile(page, 12, searchTerm);
        setUserList(res.content); // lấy danh sách user
        setTotalPages(res.totalPages); // tổng số trang
      } catch (err) {
        console.log('Error fetching user list:', err);
      }
    };
    fetchUsers();
  }, [page, searchTerm]);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const res = await countAllUsers();
        setTotalUsers(res);
      } catch (err) {
        console.log('Error fetching user count:', err);
      }
    };

    fetchTotalUsers();
  }, []);

  return (
    <div className="max-w-8xl mx-auto p-4">
      <div className="flex items-center justify-start ml-auto mb-4 gap-100">
        <div className="text-2xl font-bold text-white bg-red-600 p-5 rounded-2xl">
          Total member: {totalUsers}
        </div>
        <MySearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search by fullname or username or email"
        />
      </div>

      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Member Detail
      </h2>

      <div className="overflow-x-auto rounded-2xl shadow-md">
        <table className="min-w-full table-auto border border-gray-300 text-sm text-gray-700">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="py-2 text-center">No.</th>
              <th className="py-2 text-center">Fullname</th>
              <th className="py-2 text-center">Username</th>
              <th className="py-2 text-center">Gender</th>
              <th className="py-2 text-center">Phone</th>
              <th className="py-2 text-center">Email</th>
              <th className="py-2 text-center">Address</th>
              <th className="py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user, idx) => (
              <tr
                key={idx}
                className="even:bg-red-50 odd:bg-white cursor-pointer"
                onClick={() => setSelectedItem(user)}
              >
                <td className="py-2 text-center">{page * 12 + idx + 1}</td>
                <td className="py-2 text-center">{user?.fullName}</td>
                <td className="py-2 text-center">{user?.username}</td>
                <td className="py-2 text-center">{user?.gender}</td>
                <td className="py-2 text-center">{user?.phone}</td>
                <td className="py-2 text-center">{user?.email}</td>
                <td className="py-2 text-center">
                  {user?.address?.length > 30
                    ? user.address.slice(0, 30) + '...'
                    : user.address}
                </td>
                <td className="py-2 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBanUser(user.userId);
                    }}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 text-xs"
                  >
                    Ban
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedItem && (
          <MemberDetail
            data={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </div>

      {/* Pagination component dùng giống mẫu bạn đưa */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        inputPage={inputPage}
        setInputPage={setInputPage}
        onGoToPage={handleGoToPage}
      />
    </div>
  );
}
