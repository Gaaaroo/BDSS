import React from 'react';

export default function PostModal({
  open,
  title,
  formData,
  setFormData,
  onClose,
  onSubmit,
  submitLabel = 'Post',
}) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 w-full backdrop-brightness-50">
        <div className="bg-white rounded-lg shadow-lg w-[700px] h-[500px] p-6 relative">
          <button
            className="absolute top-1 right-2 mr-1.5 text-gray-500 hover:text-red-500 text-2xl cursor-pointer"
            onClick={onClose}
          >
            ×
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center text-red-700">
            {title}
          </h2>
          <input
            className="w-full mb-2 p-2 border border-gray-400 rounded text-black focus:outline-none text-lg"
            placeholder="Your title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <textarea
            className="w-full h-[300px] mb-2 p-2 border border-gray-400 rounded text-black focus:outline-none text-lg"
            placeholder="Your content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />
          <div className="flex justify-center">
            <button
              className="bg-[#FFA1A1] text-white px-4 py-2 rounded hover:scale-105
                transition-all duration-300 hover:bg-red-600 flex items-center justify-center
                hover: font-bold mt-1.5 cursor-pointer"
              onClick={onSubmit}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
