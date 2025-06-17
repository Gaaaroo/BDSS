import React from "react";
import { useEffect, useState } from "react";
import { getAllBloodDonateRequests } from "../services/api/bloodRequestService";
import { searchForumPosts } from "../services/api/forumService";


function getStatusColor(status) {
  switch (status) {
    case "Approve":
      return "bg-green-400 text-white";
    case "Process":
      return "bg-cyan-400 text-white";
    case "Cancel":
      return "bg-red-400 text-white";
    default:
      return "bg-gray-300 text-black";
  }
}



export default function BloodRequestTable() {

const [keyword, setKeyword] = useState('');
const [donateRequests, setDonateRequests] = useState([]);

  // view all donate request and search posts by keyword
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Search keyword:', keyword);
        let data;
        // if (keyword.trim() === '') {
          data = await getAllBloodDonateRequests();
          console.log('Fetching all posts:', data);
        // } else {
        //   data = await searchForumPosts(keyword);
        // }
        // setPosts(data);
        setDonateRequests(
          data.map((request) => ({
            ...request,
            id: request.donateId,
          }))
        );
        console.log('Posts fetched successfully', data);
      } catch (error) {
        if (error.response.data.code === 1015) setError('Not found posts');
      }
    };

    fetchPosts();
  }, []);

  return (
    <></>
    // <div className="bg-pink-300 rounded-xl p-4 mt-4">
    //   {/* Search and filter */}
    //   <div className="flex items-center justify-between mb-2">
    //     <input
    //       type="text"
    //       placeholder="Search"
    //       className="border rounded-full px-3 py-1 outline-none"
    //     />
    //     <div className="flex items-center gap-2">
    //       <span className="font-semibold">Filler</span>
    //       <button className="border rounded-full px-3 py-1 text-xs">Priority</button>
    //       <button className="border rounded-full px-3 py-1 text-xs">Priority</button>
    //     </div>
    //   </div>
    //   {/* Table */}
    //   <div className="overflow-x-auto">
    //     <table className="min-w-full bg-[#F9B3B3] rounded-lg">
    //       <thead>
    //         <tr>
    //           <th className="px-2 py-2 text-left flex items-center justify-center">RequestId</th>
    //           <th className="px-2 py-2 text-left w-48">Fullname</th>
    //           <th className="px-2 py-2 text-left flex items-center justify-center w-18">Gender</th>
    //           <th className="px-2 py-2 text-left">Blood type</th>
    //           <th className="px-2 py-2 text-left">Volume</th>
    //           <th className="px-2 py-2 text-left">Phone</th>
    //           <th className="px-2 py-2 text-left">Request date</th>
    //           <th className="px-2 py-2 text-left">Status</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {data.map((row, idx) => (
    //           <tr key={idx} className="border-b border-[#f9b3b3] ">
    //             <td className="px-2 py-1 flex items-center justify-center">
    //               <span className="bg-white text-black px-2 py-1 rounded font-semibold text-xs border
    //               flex items-center justify-center w-18">
    //                 {row.blood}
    //               </span>
    //             </td>
    //             <td className="px-2 py-1 w-48">
    //               {row.name}
    //             </td>
    //             <td className="px-2 py-1 flex items-center justify-center w-18">
    //               {row.gender}
    //             </td>
    //             <td className="px-2 py-1">{row.dob}</td>
    //             <td className="px-2 py-1">{row.required}</td>
    //             <td className="px-2 py-1">{row.member}</td>
    //             <td className="px-2 py-1">{row.phone}</td>
    //             <td className="px-2 py-1">{row.email}</td>
    //             <td className="px-2 py-1">
    //               <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
    //                 {row.status}
    //               </span>
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>
  );
}