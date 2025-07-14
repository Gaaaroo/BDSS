import React from 'react';

export default function TotalCard({ title, total, totalToday, data, color }) {
  return (
    <div className={`p-4 rounded-xl shadow-sm ${color}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-gray-500">{totalToday}</span>
      </div>
      <div className="text-3xl font-bold my-2">{total}</div>
      <div className="flex gap-3">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center w-8 bg-white rounded-lg"
          >
            <div className="flex items-center justify-center font-bold text-center w-8 h-8 bg-blue-300 rounded-lg text-blue-900 text-[15px]">
              {item.label}
            </div>
            <div className="w-7 text-center">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
