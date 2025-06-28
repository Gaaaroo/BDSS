import React, { useEffect, useState } from 'react';
import BloodCard from '../components/BloodCard';
import {
  bloodInventoryByType,
  countBloodUnit,
} from '../services/api/inventoryService';
import ListBloodType from '../components/ListBloodType';

export default function Wh() {
  const bloodGroups = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];
  const [bloodData, setBloodData] = useState({});
  const [list, setList] = useState([]);

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
  const handleClick = (item) => {
    console.log('click me', item);
    // Call APIs
    fetchAPI(item);
  };
  const fetchAPI = async (type) => {
    // Fetch API
    try {
      const res = await bloodInventoryByType(type);
      console.log('list:', res.content);
      setList(res.content);
    } catch (error) {
      console.log('list but err: ', error);
    }
    // setList([1, 2, 3, param]);
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-x-0 gap-y-7 justify-items-center px-15 py-5">
        {bloodGroups.map((item, index) => (
          <BloodCard
            key={index}
            bloodType={item}
            units={bloodData[item]}
            onClick={() => handleClick(item)}
          />
        ))}
      </div>
      <ListBloodType list={list} />
    </>
  );
}
