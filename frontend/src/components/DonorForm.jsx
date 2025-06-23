import TextInput from './TextInput';
import { useEffect, useState } from 'react';
import { useApp } from '../Contexts/AppContext';
import React from 'react';
import { useNavigate } from 'react-router';
import { donorForm } from '../services/api/bloodFormService';
import CustomModal from './CustomModal';
import { toast } from 'react-toastify';

export function Title({ title, decription }) {
  return (
    <div className="p-5 bg-red-200 h-[200px]">
      <h2 className="text-3xl font-bold text-red-700">{title}</h2>
      <p className="pt-2 text-blakck text-2xl text-justify">{decription}</p>
    </div>
  );
}

export default function DonorForm() {
  const { profile } = useApp(); //lấy profile từ context
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const handleCancel = () => {
    setShowModal(false);
    navigate('/');
  };
  const handleConfirm = () => {
    navigate('/profile', {
      state: { flag: 'update', redirectTo: '/become-a-donor' },
    });
  };
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    phone: '',
    bloodType: '',
    gender: '',
    email: '',
    address: '',
    disease: '',
  });
  function isProfileIncomplete(profile) {
    return (
      !profile.fullName ||
      !profile.phone ||
      !profile.address ||
      !profile.dob ||
      !profile.gender ||
      !profile.email ||
      !profile.bloodType
    );
  }
  useEffect(() => {
    if (profile) {
      if (isProfileIncomplete(profile)) {
        setShowModal(true);
      } else {
        setFormData({
          ...formData,
          fullName: profile.fullName,
          dob: profile.dob,
          phone: profile.phone,
          bloodType: profile.bloodType,
          gender: profile.gender,
          email: profile.email,
          address: profile.address,
        });
      }
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDonorRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await donorForm({ healthNotes: formData.disease });
      console.log('Detail donor form:', res);
      toast.success('Register successful!');
    } catch (error) {
      console.log(error);
      toast.error('Register failed');
    }
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
            onChange={() => {}}
            required
          />
          <TextInput
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={() => {}}
            required
          />
          <TextInput
            label="Phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={() => {}}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Type
            </label>
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={() => {}}
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
              onChange={() => {}}
              disabled
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
            onChange={() => {}}
            disabled
            required
          />
          <TextInput
            label="Address"
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={() => {}}
            disabled
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
      {showModal && (
        <CustomModal onCancel={handleCancel} onOk={handleConfirm}>
          <p className="text-gray-700 mb-6">
            Please update your profile before filling out the form.
          </p>
        </CustomModal>
      )}
    </form>
  );
}
