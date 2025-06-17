import React from 'react';
import dayjs from 'dayjs';

export default function BlogDetail({ blog, onBack }) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="px-3 py-1 border bg-gradient-to-r from-red-600 to-rose-600 text-white py-2 rounded-lg text-lg shadow hover:from-red-700 hover:to-rose-700 transition mb-4"
      >
        ← Back to Blogs
      </button>
      <h2 className="text-3xl font-bold mb-2">{blog.title}</h2>
      <p className="text-sm text-gray-500 mb-4">
        Created date: {dayjs(blog.createdDate).format('DD/MM/YYYY')}
      </p>
      {blog.sections?.map((section, idx) => (
        <div key={idx} className="mb-6">
          {section.imageLink && (
            <img
              src={section.imageLink}
              alt={`Section ${idx}`}
              className="h-100 w-full rounded mb-2"
            />
          )}
          <p className="text-lg text-justify">{section.content}</p>
        </div>
      ))}
    </div>
  );
}
