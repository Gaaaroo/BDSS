// export default function SearchForumPost({ searchKey, setSearchKey, handleSearch }) {

//     //Handle Enter key to send message
//     const handleKeyDown = (e) => {
//       if (e.key === "Enter" && !e.shiftKey) {
//         e.preventDefault();
//         handleSearch();
//       }
//     };

// return (
//   <>
//     <div className="w-full flex justify-center items-center mt-4 mb-6">
//       <div className="w-full max-w-md">
//         <div className="flex items-center bg-white border border-[#FFA1A1] rounded-xl shadow px-3 py-2">
//           <input
//             type="text"
//             placeholder="Search by title or content..."
//             className="flex-1 px-3 py-1 text-[15px] bg-transparent outline-none text-gray-900 placeholder-gray-400"
//             value={searchKey || ""}
//             onChange={(e) => setSearchKey(e.target.value)}
//             onKeyDown={handleKeyDown}
//           />
//           <button
//             className="ml-2 px-4 py-1 bg-[#FFA1A1] text-white rounded-lg font-semibold text-[15px] shadow hover:bg-[#F76C6C] transition"
//             onClick={handleSearch}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="inline-block w-4 h-4 mr-1 -mt-1"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
//             </svg>
//             Search
//           </button>
//         </div>
//       </div>
//     </div>
//   </>
// );
// }
import React, { useState, useRef, useEffect } from 'react';

export default function SearchForumPost({
  searchKey,
  setSearchKey,
  handleSearch,
}) {
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  // Đóng search khi click ra ngoài
  useEffect(() => {
    if (!showSearch) return;
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearch]);

  useEffect(() => {
  const timeout = setTimeout(() => {
    handleSearch();
  }, 400);
  return () => clearTimeout(timeout);
}, [searchKey]);

  return (
  <div
    className="w-full flex flex-col items-center mt-4 mb-4 relative "
    style={{ minHeight: 36 }}
  >

    <div className="w-full flex justify-end items-center pr-10 relative mt-3">
      {/* Thanh search hiện đại */}
      <div
        ref={searchRef}
        className="flex items-center mt-3 bg-white border border-[#FFA1A1] rounded-2xl shadow-lg px-3 py-1 transition-all duration-300"
        style={{
          width: showSearch ? 500 : 0,
          opacity: showSearch ? 1 : 0,
          pointerEvents: showSearch ? 'auto' : 'none',
          overflow: 'hidden',
          minHeight: 36,
          boxShadow: showSearch ? '0 4px 24px 0 #ffa1a13a' : 'none',
          marginRight: 12,
        }}
      >
        {/* Icon kính lúp nằm trong input group */}
        <div className="flex items-center flex-1 relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-[#FFA1A1] absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search posts by title or content..."
            className="pl-8 pr-3 py-1 w-full text-[15px] bg-transparent outline-none text-gray-900 placeholder-gray-400 rounded-xl transition"
            value={searchKey || ''}
            onChange={(e) => {setSearchKey(e.target.value); handleSearch(e.target.value);}}
            onKeyDown={handleKeyDown}
            autoFocus={showSearch}
            style={{
              minWidth: showSearch ? 200 : 0,
              transition: 'min-width 0.3s',
              height: 32,
              lineHeight: '32px',
            }}
          />
        </div>
        <button
          className="ml-2 mr-3 px-3 py-1 bg-gradient-to-br from-[#FFA1A1] to-[#F76C6C] text-white rounded-xl font-semibold text-[15px] shadow hover:scale-105 transition-all"
          onClick={handleSearch}
          style={{ height: 32 }}
        >
          Search
        </button>
      </div>
      {/* Nút search icon ngoài cùng bên phải */}
      {!showSearch && (
        <button
          className="bg-gradient-to-br mt-3 from-[#FFA1A1] to-[#F76C6C] shadow-lg hover:scale-110 transition-all flex items-center justify-center ml-2"
          onClick={() => setShowSearch(true)}
          title="Open search"
          style={{
            transition: 'opacity 0.3s',
            height: 40,
            width: 40,
            borderRadius: 50,
            padding: 0,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </button>
      )}
    </div>
  </div>
);
}