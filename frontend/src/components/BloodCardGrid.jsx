import React from 'react';
import BloodCard from './BloodCard';

export default function BloodCardGrid({
  bloodGroups = [],
  bloodData = {},
  handleClick = () => {},
}) {
  return (
    <div className="grid grid-cols-4 gap-x-0 gap-y-7 justify-items-center px-14 py-5">
      {bloodGroups.map((item, index) => (
        <BloodCard
          key={index}
          bloodType={item}
          units={bloodData[item]?.units ?? 0}
          request={bloodData[item]?.requests ?? 0}
          onClick={() => handleClick(item)}
        />
      ))}
    </div>
  );
}
