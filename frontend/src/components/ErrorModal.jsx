import React from 'react';

export default function ErrorModal({ open, message, onClose }) {
  if (!open) return null;
  return (
    <div className="text-base fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-brightness-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
        <div className="mb-6 text-gray-700">{message}</div>
        <button
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

//SAMPLE CODE FOR ERROR HANDLING

//catch (error)
// const backendMessage = error?.response?.data?.message;
//         const backendCode = error?.response?.data?.code;
//         setErrorModal({
//           open: true,
//           message: (
//             <>
//               {backendCode && (
//                 <div className="font-semibold text-red-500 pb-2">
//                   Error code: {backendCode}
//                 </div>
//               )}
//               <div>
//                 {backendMessage ||
//                   'Failed to delete comment. Please try again.'}
//               </div>
//             </>
//           ),
//         });
