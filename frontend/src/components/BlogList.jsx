import React, { useState } from 'react';
import dayjs from 'dayjs';

export default function BlogList({
  blogs,
  onSelectBlog,
  currentPage,
  totalPages,
  onPageChange,
}) {
  const safeBlogs = Array.isArray(blogs) ? blogs : [];
  const [inputPage, setInputPage] = useState('');

  const handleGoToPage = () => {
    const pageNum = parseInt(inputPage, 10);
    if (!isNaN(pageNum) && pageNum >= 0 && pageNum < totalPages + 1) {
      onPageChange(pageNum - 1);
      setInputPage('');
    } else {
      alert(`Please enter a valid page number between 1 and ${totalPages}`);
    }
  };

  return (
    <div className="px-6 sm:px-10 lg:px-20 py-10">
      <h2 className="text-5xl font-bold text-red-700 text-center mb-10">
        Blogs
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {safeBlogs
          .filter((blog) => blog.status === true)
          .map((blog, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => onSelectBlog(blog)}
            >
              <img
                src={blog.imageLink}
                alt={blog.title}
                className="mb-4 w-full h-70 object-cover rounded-md"
              />
              <h3 className="text-xl font-semibold mb-1 text-center">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-500 text-center mb-2">
                Created: {dayjs(blog.createdDate).format('DD/MM/YYYY')}
              </p>
              <p className="text-gray-700 text-center line-clamp-2">
                {blog.sections?.[0]?.content || 'No description'}
              </p>
            </div>
          ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 space-x-4 items-center">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
          >
            Previous
          </button>

          <span className="font-medium">
            Page {currentPage + 1} / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage + 1 >= totalPages}
            className="px-4 py-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>

          {/* Input để đi tới trang */}
          <div className="flex items-center space-x-2 ml-4">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              className="px-4 py-2 w-25 rounded border border-gray-300"
              placeholder="page"
            />
            <button
              onClick={handleGoToPage}
              className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
            >
              Move
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
