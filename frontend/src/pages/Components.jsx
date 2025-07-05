import React, { useEffect, useState } from 'react';
import {
  componentByFS,
  componentByS,
  componentByTFS,
  componentByTS,
  countBloodUnit,
  countRequest,
  listBloodComponentUnits,
} from '../services/api/inventoryService';
import Pagination from '../components/Pagination';
import InventoryDetail from '../components/InventoryDetail';
import BloodCardGrid from '../components/BloodCardGrid';
import FilterHeader from '../components/FilterHeader';

export default function Components() {
  // Card blood
  const bloodGroups = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];
  const [bloodData, setBloodData] = useState({});
  const [requestData, setRequestData] = useState({});
  //List component
  const [list, setList] = useState([]);
  //Page
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [inputPage, setInputPage] = useState('');
  //Search or filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [bloodType, setBloodType] = useState('All');
  const statusOptions = ['Stored', 'Used', 'Expired'];
  //Modal
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchBloodData = async () => {
    const results = {};
    await Promise.all(
      bloodGroups.map(async (type) => {
        try {
          const [unitRes, requestRes] = await Promise.all([
            countBloodUnit(type),
            countRequest(type, ''), // khác whole
          ]);

          results[type] = {
            units: unitRes ?? 0,
            requests: requestRes ?? 0,
          };
        } catch (error) {
          console.error(`Error fetching data for ${type}:`, error);
          results[type] = {
            units: 0,
            requests: 0,
          };
        }
      })
    );
    console.log('meo:', results);
    setBloodData(results);
  };

  const fetchAPI = async () => {
    try {
      let res = await listBloodComponentUnits(page, 10);
      // Nếu người dùng có filter, thì gọi API lọc
      const hasSearch = searchTerm.trim() !== '';
      const hasStatus = statusFilter.length > 0;
      const hasType = bloodType !== 'All';
      if (hasSearch || hasStatus || hasType) {
        const effectiveStatusFilter = hasStatus
          ? statusFilter
          : ['Stored', 'Used', 'Expired'];
        const effectiveBloodType = hasType ? bloodType : '';
        const statusString = effectiveStatusFilter.join(',');

        if (hasSearch && !hasType) {
          // Chỉ search theo fullName + status
          res = await componentByFS(
            effectiveStatusFilter,
            searchTerm,
            page,
            10
          );
        } else if (!hasSearch && hasType && statusString) {
          // Chỉ lọc theo type + status
          res = await componentByTS(effectiveBloodType, statusString, page, 10);
        } else if (hasSearch && hasType && hasStatus) {
          // fullName + type + status
          res = await componentByTFS(
            effectiveBloodType,
            effectiveStatusFilter,
            searchTerm,
            page,
            10
          );
        } else {
          //status
          res = await componentByS(statusString, page, 10);
        }
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
    fetchBloodData();
  }, []);

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
    <div className="p-5">
      <BloodCardGrid
        bloodGroups={bloodGroups}
        bloodData={bloodData}
        handleClick={(type) => setBloodType(type)}
      />
      <FilterHeader
        title="Blood Components"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        bloodType={bloodType}
        setBloodType={setBloodType}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusOptions={statusOptions}
      />
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-red-600 text-white">
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
                className="even:bg-red-50 odd:bg-white"
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
        <InventoryDetail
          data={selectedItem}
          onClose={() => setSelectedItem(null)}
          showComponentType={true}
        />
      )}
    </div>
  );
}
