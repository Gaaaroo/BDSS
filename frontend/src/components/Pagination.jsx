import React from 'react';

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  inputPage,
  setInputPage,
  onGoToPage,
}) {
  return (
    <div className="flex justify-center mt-6 items-center gap-3">
      <button
        onClick={() => onPageChange(Math.max(page - 1, 0))}
        disabled={page === 0}
        className="px-4 py-1 bg-red-500 text-white rounded disabled:opacity-50 cursor-pointer"
      >
        Prev
      </button>
      <span className="text-gray-700 text-lg font-semibold cursor-pointer">
        Page {page + 1} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(page + 1, totalPages - 1))}
        disabled={page + 1 === totalPages}
        className="px-4 py-1 bg-red-500 text-white rounded disabled:opacity-50 cursor-pointer"
      >
        Next
      </button>

      <div className="flex items-center space-x-2 ml-4">
        <input
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          className="w-20 border border-gray-300 rounded px-2 py-1"
          placeholder="Page"
        />
        <button
          onClick={onGoToPage}
          className="px-4 py-1 bg-red-700 text-white rounded hover:bg-red-80 cursor-pointer"
        >
          Go
        </button>
      </div>
    </div>
  );
}
