import React, { useEffect, useState } from 'react';
import SideBar from '../Layouts/Sidebar';
import BloodCard from '../components/BloodCard';
import { countBloodUnit } from '../services/api/inventoryService';

export default function Inventory() {
  const bloodGroups = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];
  const [bloodData, setBloodData] = useState({});

  useEffect(() => {
    const fetchAll = async () => {
      const results = {};
      await Promise.all(
        bloodGroups.map(async (type) => {
          const res = await countBloodUnit(type);
          results[type] = res ?? 0;
        })
      );
      setBloodData(results);
    };
    fetchAll();
  }, []);
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-white fixed h-full">
        <SideBar />
      </div>
      <div className="flex-1 ml-64">
        <div className="grid grid-cols-4 gap-x-0 gap-y-7 justify-items-center px-20 py-5">
          {bloodGroups.map((item, index) => (
            <BloodCard key={index} bloodType={item} units={bloodData[item]} />
          ))}
        </div>
      </div>
    </div>
  );
}
