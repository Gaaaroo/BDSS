import React, { useEffect, useState } from 'react';
import {
  filterByTypeStatusAndFullName,
  listBloodComponentUnits,
} from '../services/api/inventoryService';
import Pagination from '../components/Pagination';
import MySearch from '../components/MySearch';
import { Funnel } from 'lucide-react';
import ComponentBloodDetail from '../components/ComponentBloodDetail';

export default function Components() {
  const [list, setList] = useState([]);
  //Page
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [inputPage, setInputPage] = useState('');
  //Search or filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [bloodType, setBloodType] = useState('All');
  //Modal
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchAPI = async () => {
    try {
      let res = await listBloodComponentUnits(page, 10);

      // Nếu người dùng có filter, thì gọi API lọc
      if (
        searchTerm.trim() !== '' ||
        statusFilter.length > 0 ||
        bloodType !== 'All'
      ) {
        const effectiveStatusFilter =
          statusFilter.length > 0
            ? statusFilter
            : ['Stored', 'Used', 'Expired'];
        const effectiveBloodType = bloodType === 'All' ? '' : bloodType;

        res = await filterByTypeStatusAndFullName(
          effectiveBloodType,
          effectiveStatusFilter,
          searchTerm,
          page,
          10
        );
      }
      if (res?.content) {
        setList(res.content);
        setTotalPages(res.totalPages);
      } else {
        setList([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setList([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, [page, searchTerm, statusFilter, bloodType]);

  const handleGoToPage = () => {
    const pageNumber = parseInt(inputPage, 10) - 1;
    if (!isNaN(pageNumber) && pageNumber >= 0 && pageNumber < totalPages) {
      setPage(pageNumber);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold text-rose-600">Blood Components</h2>
        {/* Thanh search */}
        <MySearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search"
        />

        <div className="flex items-center gap-2">
          <label className="text-gray-600 font-medium text-sm">
            Blood Type:
          </label>
          <select
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            className="border border-red-300 rounded px-3 py-1 text-sm font-medium text-gray-800 focus:outline-none hover:bg-red-100"
          >
            <option value="All">All Types</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-gray-600 font-medium text-sm">
            <Funnel className="w-5 h-5 text-gray-500" />
          </label>
          <select
            value={statusFilter[0] || 'All'}
            onChange={(e) =>
              setStatusFilter(e.target.value === 'All' ? [] : [e.target.value])
            }
            className="border border-red-300 rounded px-3 py-1 text-sm font-medium text-gray-800 focus:outline-none hover:bg-red-100"
          >
            <option value="All">All Status</option>
            <option value="Stored">Stored</option>
            <option value="Used">Used</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-red-600 text-white text-lg">
          <tr>
            <th className="py-2 text-center">No.</th>
            <th className="py-2 text-center">Full Name</th>
            <th className="py-2 text-center">Blood Type</th>
            <th className="py-2 text-center">Component Type</th>
            <th className="py-2 text-center">Volume</th>
            <th className="py-2 text-center">Status</th>
            <th className="py-2 text-center">Created Date</th>
            <th className="py-2 text-center">Expiry Date</th>
            <th className="py-2 text-center">Note</th>
            <th className="py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={10} className="py-2 text-center text-red-500">
                No information found.
              </td>
            </tr>
          ) : (
            list.map((item, index) => (
              <tr
                key={item.id || index}
                className="even:bg-rose-100 odd:bg-white"
              >
                <td className="py-2 text-center">{page * 10 + index + 1}</td>
                <td className="py-2 text-center">
                  {item.userResponse?.fullName}
                </td>
                <td className="py-2 text-center">{item.bloodType}</td>
                <td className="py-2 text-center">{item.componentType}</td>
                <td className="py-2 text-center">{item.volume}</td>
                <td className="py-2 text-center">{item.status}</td>
                <td className="py-2 text-center">
                  {item.createdDate?.slice(0, 10)}
                </td>
                <td className="py-2 text-center">
                  {item.expiryDate?.slice(0, 10)}
                </td>
                <td className="py-2 text-center">{item.note}</td>

                <td className="py-2 text-center space-x-1">
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 text-xs"
                    onClick={() => setSelectedItem(item)}
                  >
                    View
                  </button>
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 text-xs"
                    onClick={() => alert(`Delete ${item.bloodId}`)}
                  >
                    None
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        inputPage={inputPage}
        setInputPage={setInputPage}
        onGoToPage={handleGoToPage}
      />
      {selectedItem && (
        <ComponentBloodDetail
          data={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
