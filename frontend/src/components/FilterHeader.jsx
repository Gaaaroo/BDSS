import React from 'react';
import MySearch from './MySearch';
import { Funnel } from 'lucide-react';

export default function FilterHeader({
  title = 'Filter Section',
  searchTerm,
  setSearchTerm,
  setBloodType,
  statusFilter,
  setStatusFilter,
  statusOptions,
}) {
  const handleStatusChange = (status) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <h2
        onClick={() => setBloodType('All')}
        className="text-2xl font-bold text-rose-600 cursor-pointer hover:text-rose-800"
      >
        {title}
      </h2>

      <MySearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search"
      />

      {/* Status Filter - Multiple Checkboxes */}
      <div className="flex items-center gap-3">
        <Funnel className="w-6 h-6 text-gray-500" />
        <div className="flex flex-wrap gap-4">
          {statusOptions.map((status) => (
            <label
              key={status}
              className="flex items-center text-base text-gray-800 font-medium"
            >
              <input
                type="checkbox"
                value={status}
                checked={statusFilter.includes(status)}
                onChange={() => handleStatusChange(status)}
                className="mr-2 w-5 h-5 accent-red-500"
              />
              {status}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
