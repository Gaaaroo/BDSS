import React from 'react';
import MySearch from './MySearch';
import { Funnel } from 'lucide-react';

export default function FilterHeader({
  title = 'Filter Section',
  searchTerm,
  setSearchTerm,
  bloodType,
  setBloodType,
  statusFilter,
  setStatusFilter,
  statusOptions,
}) {
  const bloodOptions = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const handleStatusChange = (status) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <h2 className="text-2xl font-bold text-rose-600">{title}</h2>

      <MySearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search"
      />

      {/* Blood Type */}
      <div className="flex items-center gap-2">
        <label className="text-gray-600 font-medium text-sm">Blood Type:</label>
        <select
          value={bloodType}
          onChange={(e) => setBloodType(e.target.value)}
          className="border border-red-300 rounded px-3 py-1 text-sm font-medium text-gray-800 focus:outline-none hover:bg-red-100"
        >
          <option value="All">All Types</option>
          {bloodOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

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
