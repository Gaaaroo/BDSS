import React from 'react';
import dayjs from 'dayjs';

export default function BlogDetail({ blog, onBack }) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-4 text-blue-600 underline">
        ← Quay lại danh sách
      </button>
      <h2 className="text-3xl font-bold mb-2">{blog.title}</h2>
      <p className="text-sm text-gray-500 mb-4">
        Ngày tạo: {dayjs(blog.createdDate).format('DD/MM/YYYY')}
      </p>
      {blog.sections?.map((section, idx) => (
        <div key={idx} className="mb-6">
          {section.imageLink && (
            <img
              src={section.imageLink}
              alt={`Section ${idx}`}
              className="w-full rounded mb-2"
            />
          )}
          <p>{section.content}</p>
        </div>
      ))}
    </div>
  );
}
