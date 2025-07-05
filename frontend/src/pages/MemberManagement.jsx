import React, { useEffect, useState } from 'react';
import { getAllUserProfile } from '../services/api/userService';
import MySearch from '../components/MySearch';
import MemberDetail from '../components/MemberDetail';

export default function MemberManagement() {
  const [user, setUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  //Modal
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredUsers = user.filter((user) => {
    const fullName = (user.fullName ?? '').toLowerCase();
    const username = (user.username ?? '').toLowerCase();
    const phone = user.phone ?? '';
    const address = (user.address ?? '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) ||
      username.includes(search) ||
      phone.includes(search) ||
      address.includes(search)
    );
  });
  useEffect(() => {
    const fetchAllUsersProfile = async () => {
      try {
        const res = await getAllUserProfile();
        setUser(
          res?.length ? res.filter((user) => user.role === 'MEMBER') : []
        );
        // console.log('data user:', res);
      } catch (err) {
        console.log('Error when get all user:', err);
      }
    };
    fetchAllUsersProfile();
  }, []);
  return (
    <div className="max-w-8xl mx-auto p-4">
      <div className="flex items-center justify-start ml-auto mb-4 gap-100">
        <div className="text-2xl font-bold text-white bg-red-600 p-5 rounded-2xl">
          Total member : {user.length}
        </div>
        {/* Thanh search */}
        <MySearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search"
        />
      </div>
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Member Detail
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-gray-700">
          <thead className="bg-red-600 text-white text-lg">
            <tr>
              <th className="px-4 py-2 text-left">No.</th>
              <th className="px-4 py-2 text-left">Fullname</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Gender</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr key={idx} className="even:bg-rose-100">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2 font-medium  w-[200px]">
                  {user?.fullName}
                </td>
                <td className="px-4 py-2">{user?.username}</td>
                <td className="px-4 py-2 text-left">{user?.gender}</td>
                <td className="px-4 py-2 text-left">{user?.phone}</td>
                <td className="px-4 py-2 text-left">{user?.email}</td>
                <td className="px-4 py-2">
                  {user?.address?.length > 30
                    ? user.address.slice(0, 30) + '...'
                    : user.address}
                </td>
                <td className="py-2 text-center space-x-1">
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 text-xs"
                    onClick={() => setSelectedItem(user)}
                  >
                    View
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
    </div>
  );
}
