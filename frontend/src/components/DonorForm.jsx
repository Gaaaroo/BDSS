import TextInput from "./TextInput";
import { useState } from "react";

import React from "react";

export function Title({ title, decription }) {
  return (
    <div className="p-5 bg-red-200 h-[200px]">
      <h2 className="text-3xl font-bold text-red-700">{title}</h2>
      <p className="pt-2 text-blakck text-2xl text-justify">{decription}</p>
    </div>
  );
}

export default function DonorForm() {
  const [showModal, setShowModal] = useState(false);
  const [myProfile, setMyProfile] = useState(null);
  const [diseaseData, setdiseaseData] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDonorRegister = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form
      onSubmit={handleDonorRegister}
      className="space-y-4 bg-gray-50 py-20 mx-[200px] my-20 rounded-2xl items-center"
    >
      <h1 className="text-4xl font-extrabold text-center text-red-700 mb-10 tracking-wide">
        Register for Blood Donation
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 px-[150px]">
        {/* Left Column */}
        <div className="space-y-4">
          <TextInput
            label="Full Name"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Type
            </label>
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              required
              className="w-full text-lg px-3 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-rose-200 transition"
            >
              <option value="">Select blood type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>
        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full text-lg px-3 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-rose-200 transition"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <TextInput
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Address"
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Any blood related disease"
            name="disease"
            placeholder="Specify if any"
            value={formData.disease}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="px-5 py-1.5 text-xl text-white bg-red-700 font-bold border-2 border-red-700 hover:bg-red-500 hover:text-white transition"
        >
          Register
        </button>
      </div>
    </form>
  );
}
