import React, { useState } from 'react';
import BloodDocs from './BloodDocs';
import MiniBloodUnitForumStat from './MiniBloodUnitForumStat';

export default function BloodCompatibilityChecker() {
  const [recipientBloodType, setRecipientBloodType] = useState('');
  const [transfusionType, setTransfusionType] = useState('');
  const [compatibleDonors, setCompatibleDonors] = useState([]);

  const bloodCompatibilityData = {
    whole: {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'],
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-'],
    },
    rbc: {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'],
      'AB-': ['AB-', 'A-', 'B-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-'],
    },
    plasma: {
      'A+': ['A+', 'AB+', 'AB-'],
      'A-': ['A-', 'AB-'],
      'B+': ['B+', 'AB+', 'AB-'],
      'B-': ['B-', 'AB-'],
      'AB+': ['AB+'],
      'AB-': ['AB-'],
      'O+': ['A+', 'B+', 'AB+', 'O+'],
      'O-': ['A-', 'B-', 'AB-', 'O-'],
    },
    platelets: {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'],
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-'],
    },
    wbc: {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'],
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-'],
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recipientBloodType) {
      setCompatibleDonors([]);
      alert('Please select blood type!');
      return;
    }
    if (!transfusionType) {
      setCompatibleDonors([]);
      alert('Please select transfusion type!');
      return;
    }
    if (!recipientBloodType && !transfusionType) {
      setCompatibleDonors([]);
      alert('Please select both blood type and transfusion type!');
      return;
    }
    const result =
      bloodCompatibilityData[transfusionType][recipientBloodType] || [];
    setCompatibleDonors(result);
    console.log('Compatible donors:', result);
  };

  return (
    <>
      <div className="absolute left-1/2 top-[50] transform -translate-x-1/2 -translate-y-1/2 w-full flex justify-center h-15">
        <form
          className="flex items-center gap-2 p-4 rounded-[50px] shadow-lg relative w-3xl 
      bg-[#FFDEDE] hover:scale-103 transition duration-300"
          onSubmit={handleSubmit}
        >
          {/* <input
            type="text"
            placeholder="Search for blood documents..."
            className="absolute left-1/13 p-2 rounded-[50px]  border-gray-300 w-130 
            hover:scale-100 transition duration-300 focus:outline-none focus:underline focus:underline-offset-4 
            text-base text-[17px]"
          /> */}
          <label className="absolute left-1/15 text-black">
            Choose a bloodtype:
          </label>
          <select
            className="absolute left-4/15 p-2 rounded-[50px] w-17 
            ml-[7px] bg-[#FFA1A1]
            hover:scale-110 transition duration-300 
            text-base text-[17px] text-black
             "
            value={recipientBloodType}
            onChange={(e) => setRecipientBloodType(e.target.value)}
          >
            <option value=""></option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          <label className="absolute left-6/15 text-black">
            Type of transfusion:
          </label>
          <select
            className="absolute left-9/15 p-2 rounded-[50px] w-27 
            bg-[#FFA1A1]
            hover:scale-110 transition duration-300 
            text-base text-[17px] text-black"
            value={transfusionType}
            onChange={(e) => setTransfusionType(e.target.value)}
          >
            <option value=""></option>
            <option value="whole">Whole</option>
            <option value="rbc">RBCs</option>
            <option value="wbc">WBCs</option>
            <option value="plasma">Plasma</option>
            <option value="platelets">Platelets</option>
          </select>

          <button
            type="submit"
            className="absolute left-12/15 bg-[#FFA1A1] rounded-[50px] text-black px-6 py-2 
            hover:bg-[#FD3131] transition duration-300 hover:text-white 
            text-[17px] hover:scale-110 "
          >
            Search
          </button>
        </form>
      </div>
      <div className='mt-8 mb-2'>
        <MiniBloodUnitForumStat />
      </div>
      <div className="w-full flex justify-center mt-4 mb-4">
        <h2 className="text-2xl font-bold text-black bg-[#FFA1A1] bg-opacity-80 px-6 py-2 rounded-full shadow mt-5">
          Blood Compatibility Checker
        </h2>
      </div>
      {compatibleDonors.length === 0 ? (
        <>
          <div className="absolute top-[370px] transform items-center flex flex-row ">
            <BloodDocs />
          </div>
        </>
      ) : (
        <div>
          <div className="absolute left-1/2 top-[355px] transform -translate-x-1/2 w-[600px] bg-white bg-opacity-90 rounded-xl shadow-lg border-2 border-[#FFA1A1] p-6 mt-8 flex flex-col items-center">
            <ul className="flex flex-wrap gap-3 justify-center">
              {compatibleDonors.length === 0 ? (
                <li className="text-gray-400 italic">No result</li>
              ) : (
                compatibleDonors.map((blood) => (
                  <li
                    key={blood}
                    className="bg-[#FFA1A1] text-white font-semibold px-4 py-2 rounded-full shadow hover:bg-[#FD3131] transition"
                  >
                    {blood}
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="absolute top-[495px] transform items-center flex flex-row ">
            {compatibleDonors.map((blood) => (
              <BloodDocs key={blood} bloodT={blood} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
