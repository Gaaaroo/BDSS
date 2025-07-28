import React, { useEffect, useState } from 'react';
import BloodCard from '../components/BloodCard';
import {
  filterBloodUnits,
  countBloodUnit,
  countRequest,
} from '../services/api/inventoryService';
import { sendEncouragementEmailByBloodType } from '../services/api/userService';
import ListBloodType from '../components/ListBloodType';
import BloodCardGrid from '../components/BloodCardGrid';
import FilterHeader from '../components/FilterHeader';
import Pagination from '../components/Pagination';

export default function Whole() {
  const bloodGroups = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];
  const statusOptions = ['Stored', 'Separated', 'Used', 'Expired'];
  const [bloodData, setBloodData] = useState({});
  const [list, setList] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  //Page
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [inputPage, setInputPage] = useState('');
  //Search or filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [bloodType, setBloodType] = useState('All');
  //Count -> set in bloodCart
  const fetchBloodData = async () => {
    const results = {};
    await Promise.all(
      bloodGroups.map(async (type) => {
        try {
          const [unitRes, requestRes] = await Promise.all([
            countBloodUnit(type),
            countRequest(type, 'Whole'),
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
    setBloodData(results);
  };

  const fetchAPI = async () => {
    try {
      const res = await filterBloodUnits({
        bloodType: bloodType !== 'All' ? bloodType : undefined,
        statuses: statusFilter,
        fullName: searchTerm.trim() !== '' ? searchTerm : undefined,
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
    setPage(0);
  }, [searchTerm, statusFilter, bloodType]);

  useEffect(() => {
    console.log('Calling API with:', {
      bloodType,
      statuses: statusFilter,
      fullName: searchTerm.trim(),
      page,
    });
    fetchAPI();
  }, [page, searchTerm, statusFilter, bloodType]);

  const handleGoToPage = () => {
    const pageNumber = parseInt(inputPage, 10) - 1;
    if (!isNaN(pageNumber) && pageNumber >= 0 && pageNumber < totalPages) {
      setPage(pageNumber);
    }
  };

  const handleSendEmail = async (bloodType) => {
    try {
      await sendEncouragementEmailByBloodType(bloodType);
      alert(`Đã gửi email khuyến khích cho nhóm máu ${bloodType}`);
    } catch (error) {
      alert('Gửi email thất bại');
      console.error(error);
    }
  };

  const shouldShowEncouragementButton = () => {
    if (!selectedType) return false;
    const { units = 0, requests = 0 } = bloodData[selectedType] || {};
    return units === 0 || requests > units;
  };

  return (
    <div className="p-5">
      <BloodCardGrid
        bloodGroups={bloodGroups}
        bloodData={bloodData}
        handleClick={(type) => {
          setBloodType(type);
          setSelectedType(type);
        }}
      />

      <FilterHeader
        title="Blood Whole"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        bloodType={bloodType}
        setBloodType={(type) => {
          setBloodType(type);
          setSelectedType(''); // Reset khi bấm "Blood Whole"
        }}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusOptions={statusOptions}
        showEncouragementButton={shouldShowEncouragementButton()}
        selectedType={selectedType}
        handleSendEmail={handleSendEmail}
      />

      {/* List Whole */}
      <ListBloodType list={list} fetchList={fetchAPI} />
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
