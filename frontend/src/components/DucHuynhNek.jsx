import React, { useState } from 'react';

export default function DucHuynhNek({ receiveId }) {
  const [openPopup, setOpenPopup] = useState(false);

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  return (
    <>
      <button
        className="mt-4 px-3 py-2 hover:bg-text-red-600 bg-[#F76C6C] hover:scale-105 transition-transform duration-200 hover:text-white text-white rounded-[50px] font-semibold block mx-auto"
        onClick={handleOpenPopup}
      >
        Find Blood From Inventory
      </button>

      {openPopup && (
        <div className="fixed inset-0 bg-black/30 z-40">
          <div className="ml-64 fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-md relative mx-2">
              <button
                className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-2xl"
                onClick={() => setOpenPopup(false)}
              >
                ×
              </button>

              <h2 className="text-xl font-bold mb-4 text-center text-black">
                Find Blood From Inventory
              </h2>
              <h3>GUD LUCK DUC HUYNH</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
