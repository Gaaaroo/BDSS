import React, { useEffect, useState } from 'react';
import BloodCard from '../components/BloodCard';
import {
  bloodUnitByFS,
  bloodUnitByS,
  bloodUnitByTFS,
  bloodUnitByTS,
  countBloodUnit,
  listBloodUnits,
} from '../services/api/inventoryService';
import ListBloodType from '../components/ListBloodType';
import BloodCardGrid from '../components/BloodCardGrid';
import FilterHeader from '../components/FilterHeader';
import Pagination from '../components/Pagination';

export default function Whole() {
  const bloodGroups = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];
  const [bloodData, setBloodData] = useState({});
  const [list, setList] = useState([]);
  //Page
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [inputPage, setInputPage] = useState('');
  //Search or filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [bloodType, setBloodType] = useState('All');
  const statusOptions = ['Stored', 'Separated'];

  //Count -> set in bloodCart
  const fetchBloodData = async () => {
    const results = {};
    await Promise.all(
      bloodGroups.map(async (type) => {
        try {
          const res = await countBloodUnit(type);
          results[type] = res ?? 0;
        } catch (error) {
          results[type] = 0;
        }
      })
    );
    setBloodData(results);
  };

  const fetchAPI = async () => {
    try {
      let res = await listBloodUnits(page, 10);

      const hasSearch = searchTerm.trim() !== '';
      const hasStatus = statusFilter.length > 0;
      const hasType = bloodType !== 'All';

      if (hasSearch || hasStatus || hasType) {
        const effectiveStatusFilter = hasStatus
          ? statusFilter
          : ['Stored', 'Separated'];
        const effectiveBloodType = hasType ? bloodType : '';

        if (hasSearch && !hasType) {
          res = await bloodUnitByFS(
            effectiveStatusFilter,
            searchTerm,
            page,
            10
          );
        } else if (!hasSearch && hasType && hasStatus) {
          res = await bloodUnitByTS(
            effectiveBloodType,
            effectiveStatusFilter,
            page,
            10
          );
        } else if (hasSearch && hasType && hasStatus) {
          // Gọi API filter theo Type + Fullname + Status
          res = await bloodUnitByTFS(
            effectiveBloodType,
            effectiveStatusFilter,
            searchTerm,
            page,
            10
          );
        } else {
          res = await bloodUnitByS(effectiveStatusFilter, page, 10);
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
        title="Blood Whole"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        bloodType={bloodType}
        setBloodType={setBloodType}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusOptions={statusOptions}
      />
      {/* List Whole */}
      <ListBloodType list={list} />
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
