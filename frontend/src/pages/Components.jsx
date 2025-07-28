import React, { useEffect, useState } from 'react';
import {
  countBloodComponentUnit,
  countRequest,
  filterBloodComponentUnits,
} from '../services/api/inventoryService';
import { sendEncouragementEmailByBloodType } from '../services/api/userService';
import Pagination from '../components/Pagination';
import InventoryDetail from '../components/InventoryDetail';
import BloodCardGrid from '../components/BloodCardGrid';
import FilterHeader from '../components/FilterHeader';

export default function Components() {
  // Card blood
  const bloodGroups = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];
  const [bloodData, setBloodData] = useState({});
  const [selectedType, setSelectedType] = useState('');
  //const [requestData, setRequestData] = useState({});
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
    try {
      const [unitRes, requestCounts] = await Promise.all([
        countBloodComponentUnit(),
        Promise.all(
          bloodGroups.map(
            (type) => countRequest(type, 'Platelet') // vẫn phải gọi riêng từng nhóm vì request không gom
          )
        ),
      ]);

      const results = {};
      bloodGroups.forEach((type, index) => {
        results[type] = {
          units: unitRes?.[type] ?? 0,
          requests: requestCounts[index] ?? 0,
        };
      });

      setBloodData(results);
    } catch (error) {
      console.error('Error fetching blood component data:', error);
    }
  };

  const fetchAPI = async () => {
    try {
      const effectiveStatusFilter =
        statusFilter.length > 0 ? statusFilter : ['Stored', 'Used', 'Expired'];
      const effectiveBloodType = bloodType !== 'All' ? bloodType : '';

      const res = await filterBloodComponentUnits({
        bloodType: effectiveBloodType,
        statuses: effectiveStatusFilter,
        fullName: searchTerm.trim(),
        page,
        size: 10,
      });

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

  const shouldShowEncouragementButton = () => {
    if (!selectedType) return false;
    const { units = 0, requests = 0 } = bloodData[selectedType] || {};
    return units === 0 || requests > units;
  };

  const handleSendEmail = async (bloodType) => {
    try {
      await sendEncouragementEmailByBloodType(bloodType);
      alert(`Encouragement email sent to blood type ${bloodType}`);
    } catch (error) {
      alert('Failed to send encouragement email.');
      console.error(error);
    }
  };

  return (
    <div className="p-5">
      <BloodCardGrid
        bloodGroups={bloodGroups}
        bloodData={bloodData}
        handleClick={(type) => {
          setBloodType(type);
          setSelectedType(type); // THÊM DÒNG NÀY
        }}
      />
      <FilterHeader
        title="Blood Components"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        bloodType={bloodType}
        setBloodType={(type) => {
          setBloodType(type);
          setSelectedType(''); // Reset nếu chọn All
        }}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusOptions={statusOptions}
        showEncouragementButton={shouldShowEncouragementButton()}
        selectedType={selectedType}
        handleSendEmail={handleSendEmail}
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
                className="even:bg-red-50 odd:bg-white cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <td className="py-2 text-center">{page * 10 + index + 1}</td>
                <td className="py-2 text-center">
                  {item.userResponse?.fullName}
                </td>
                <td className="py-2 text-center">{item.bloodType}</td>
                <td className="py-2 text-center">{item.componentType}</td>
                <td className="py-2 text-center">{item.volume}</td>
                <td className="py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
    ${
      item.status === 'Stored'
        ? 'text-green-700 bg-green-100'
        : item.status === 'Separated'
        ? 'text-blue-700 bg-blue-100'
        : item.status === 'Used'
        ? 'text-gray-700 bg-gray-200'
        : item.status === 'Expired'
        ? 'text-red-700 bg-red-100'
        : 'text-yellow-700 bg-yellow-100' // default
    }
  `}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-2 text-center">
                  {item.createdDate?.slice(0, 10)}
                </td>
                <td className="py-2 text-center">
                  {item.expiryDate?.slice(0, 10)}
                </td>
                <td className="py-2 text-center">{item.note}</td>
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
