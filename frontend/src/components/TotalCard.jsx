import React from 'react';

export default function TotalCard({ title, total, totalToday, data, color }) {
  return (
    <div className={`p-4 rounded-xl shadow-sm ${color}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-gray-500">Today: {totalToday}</span>
      </div>
      <div className="text-3xl font-bold my-2">{total}</div>
      <div className="flex gap-5">
        {data.map((item, idx) => (
          <div key={idx} className="text-center">
            <div className="font-bold text-center">{item.label}</div>
            <div>{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
