import React from "react";

const data = [
  {
    blood: "unknown",
    name: "Nguyễn Minh Châu",
    gender: "Male",
    dob: "20-9-2024",
    required: "20-9-2024",
    member: "DucVo",
    phone: "0987654321",
    email: "DucVo",
    status: "Process",
  },
  {
    blood: "A+",
    name: "Nguyễn Đức Huỳnh",
    gender: "Female",
    dob: "20-9-2024",
    required: "20-9-2024",
    member: "DucVo",
    phone: "0987654321",
    email: "DucVo",
    status: "Approve",
  },
  {
    blood: "unknown",
    name: "Nguyễn Đức Võ",
    gender: "Male",
    dob: "20-9-2024",
    required: "20-9-2024",
    member: "DucVo",
    phone: "0987654321",
    email: "DucVo",
    status: "Process",
  },

];

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
  return (
    <div className="bg-pink-300 rounded-xl p-4 mt-4">
      {/* Search and filter */}
      <div className="flex items-center justify-between mb-2">
        <input
          type="text"
          placeholder="Search"
          className="border rounded-full px-3 py-1 outline-none"
        />
        <div className="flex items-center gap-2">
          <span className="font-semibold">Filler</span>
          <button className="border rounded-full px-3 py-1 text-xs">Priority</button>
          <button className="border rounded-full px-3 py-1 text-xs">Priority</button>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#F9B3B3] rounded-lg">
          <thead>
            <tr>
              <th className="px-2 py-2 text-left">Blood Type</th>
              <th className="px-2 py-2 text-left">Name</th>
              <th className="px-2 py-2 text-left">Gender</th>
              <th className="px-2 py-2 text-left">Date of Birth</th>
              <th className="px-2 py-2 text-left">Date Required</th>
              <th className="px-2 py-2 text-left">Member</th>
              <th className="px-2 py-2 text-left">Phone</th>
              <th className="px-2 py-2 text-left">Email</th>
              <th className="px-2 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b border-[#f9b3b3]">
                <td className="px-2 py-1">
                  <span className="bg-white text-black px-2 py-1 rounded font-semibold text-xs border">{row.blood}</span>
                </td>
                <td className="px-2 py-1">{row.name}</td>
                <td className="px-2 py-1">{row.gender}</td>
                <td className="px-2 py-1">{row.dob}</td>
                <td className="px-2 py-1">{row.required}</td>
                <td className="px-2 py-1">{row.member}</td>
                <td className="px-2 py-1">{row.phone}</td>
                <td className="px-2 py-1">{row.email}</td>
                <td className="px-2 py-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}