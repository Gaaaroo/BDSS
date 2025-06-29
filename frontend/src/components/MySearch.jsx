import { Search } from 'lucide-react';
import React from 'react';

export default function MySearch({ searchTerm, setSearchTerm, placeholder }) {
  return (
    <div className="flex items-center border border-gray-300 rounded-3xl px-3 w-1/3 bg-white">
      <Search className="w-5 h-5 text-gray-500" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 ml-2 p-2 outline-none text-gray-700 bg-transparent"
      />
    </div>
  );
}
