import React, { useEffect } from 'react';
import SideBar from '../Layouts/Sidebar';
import { getAllUserProfile } from '../services/api/userService';
import { Funnel, Search } from 'lucide-react';

export default function MemberManagement() {
  const [user, setUser] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');

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
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-white fixed h-full">
        <SideBar />
      </div>
      <div className="flex-1 ml-64">
        <div className="max-w-8xl mx-auto p-4">
          <div className="flex items-center justify-start ml-auto mb-4 gap-100">
            <div className="text-2xl font-bold text-white bg-red-600 p-5 rounded-2xl">
              Total member : {user.length}
            </div>
            <div className="flex items-center border border-gray-300 rounded-3xl px-3 w-1/3 bg-white">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 ml-2 p-2 outline-none text-gray-700 bg-transparent"
              />
            </div>
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
                    <td className="px-4 py-2">{user?.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
