import React, { useState } from "react";

export default function BloodCompatibilityChecker() {
  const [recipientBloodType, setRecipientBloodType] = useState("A+");
  const [transfusionType, setTransfusionType] = useState("whole");
  const [compatibleDonors, setCompatibleDonors] = useState([]);

  const bloodCompatibilityData = {
    whole: {
      "A+": ["A+", "A−", "O+", "O−"],
      "A−": ["A−", "O−"],
      "B+": ["B+", "B−", "O+", "O−"],
      "B−": ["B−", "O−"],
      "AB+": ["A+", "B+", "AB+", "O+", "A−", "B−", "AB−", "O−"],
      "AB−": ["A−", "B−", "AB−", "O−"],
      "O+": ["O+", "O−"],
      "O−": ["O−"],
    },
    rbc: {
      "A+": ["A+", "A−", "O+", "O−"],
      "A−": ["A−", "O−"],
      "B+": ["B+", "B−", "O+", "O−"],
      "B−": ["B−", "O−"],
      "AB+": ["All"],
      "AB−": ["AB−", "A−", "B−", "O−"],
      "O+": ["O+", "O−"],
      "O−": ["O−"],
    },
    plasma: {
      "A+": ["A+", "AB+", "AB−"],
      "A−": ["A−", "AB−"],
      "B+": ["B+", "AB+", "AB−"],
      "B−": ["B−", "AB−"],
      "AB+": ["AB+"],
      "AB−": ["AB−"],
      "O+": ["A+", "B+", "AB+", "O+"],
      "O−": ["A−", "B−", "AB−", "O−"],
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recipientBloodType || !transfusionType) {
      alert("Please select both blood type and transfusion type!");
      return;
    }
    const result =
      bloodCompatibilityData[transfusionType][recipientBloodType] || [];
    setCompatibleDonors(result);
    console.log("Compatible donors:", result);
  };

  return (
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
        <label className="absolute left-1/15">Choose a bloodtype:</label>
        <select
          className="absolute left-4/15 p-2 rounded-[50px] w-17 
            ml-[7px] bg-[#FFA1A1]
            hover:scale-110 transition duration-300 
            text-base text-[17px]
             "
          value={recipientBloodType}
          onChange={(e) => setRecipientBloodType(e.target.value)}
        >
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <label className="absolute left-6/15">Type of transfusion:</label>
        <select
          className="absolute left-9/15 p-2 rounded-[50px] w-27 
            bg-[#FFA1A1]
            hover:scale-110 transition duration-300 
            text-base text-[17px]"
          value={transfusionType}
          onChange={(e) => setTransfusionType(e.target.value)}
        >
          <option value="whole">Whole</option>
          <option value="rbc">RBC</option>
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
  );
}
