import { useState } from 'react';
import img from '../assets/images/logo.jpg'; // Replace with dynamic image if needed

export default function BloodDoc({ bloodType, image, description, document }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="bg-[#FFDEDE] w-80 h-115 m-5 rounded-3xl shadow-xl flex flex-col
        items-center p-6 transition-transform hover:scale-105"
      >
        <img
          src={img}
          alt={`${bloodType} icon`}
          className="w-16 h-16 mb-3 object-contain rounded-full border-2 border-[#FFA1A1] shadow"
        />
        <div className="font-bold text-xl text-[#FD3131] mb-2">{bloodType}</div>
        <div className="text-base text-gray-800 text-center font-medium mb-2">
          {description}
        </div>
        <div className="text-sm text-gray-600 text-justify bg-white bg-opacity-70 rounded-xl px-4 py-2 mt-auto shadow-inner">
          {document.slice(0, 150)}...
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-3 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Read more
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div className="bg-white max-w-2xl w-full p-6 rounded-lg relative max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="text-2xl font-bold text-[#FD3131] mb-4">
              Blood Type {bloodType} Details
            </h2>
            <p className="text-gray-800 whitespace-pre-line">{document}</p>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-red-600"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}