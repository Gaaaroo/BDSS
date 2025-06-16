import React from 'react';
import dayjs from 'dayjs';

export default function BlogList({ blogs, onSelectBlog }) {
  return (
    <div className="px-20 py-10">
      <h2 className="text-5xl font-bold text-red-700 text-center mb-10">
        Blogs
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {blogs
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
              <p className="text-gray-700 text-center line-clamp-4">
                {blog.sections?.[0]?.content || 'No description'}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
