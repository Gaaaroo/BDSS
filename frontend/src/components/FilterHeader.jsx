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

      {/* Status */}
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
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
