import React from 'react';
import MySearch from './MySearch';
import { Funnel, Mail } from 'lucide-react';

export default function FilterHeader({
  title = 'Filter Section',
  searchTerm,
  setSearchTerm,
  setBloodType,
  statusFilter,
  setStatusFilter,
  statusOptions,
  showEncouragementButton = false,
  selectedType = '',
  handleSendEmail = () => {},
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

      <div className="w-10 flex justify-end relative overflow-visible">
        {showEncouragementButton && (
          <>
            <div className="absolute -left-10 top-2 w-8 h-5 overflow-hidden">
              <div className="animate-arrow text-red-500 font-bold">➤</div>
            </div>

            <button
              onClick={() => handleSendEmail(selectedType)}
              title={`Send encouragement for blood type ${selectedType}`}
              className="text-rose-600 hover:text-rose-700 transition-all"
            >
              <Mail className="w-8 h-8" />
            </button>
          </>
        )}
      </div>

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
