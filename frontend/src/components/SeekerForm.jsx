import TextInput from './TextInput';
import { useEffect, useState } from 'react';
import { useApp } from '../Contexts/AppContext';
export default function SeekerForm() {
  const { profile } = useApp(); //lấy profile từ context
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    phone: '',
    gender: '',
    email: '',
    volume: '',
    bloodType: '',
    priority: '',
    type: '',
    quantity: '',
    hospital_address: '',
  });

  useEffect(() => {
    console.log('data from profile:', profile);
    if (profile) {
      setFormData({
        ...formData,
        fullName: profile.full_name,
        dob: profile.dob,
        phone: profile.phone,
        gender: profile.gender,
        email: profile.email,
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSeekerRegister = (e) => {
    e.preventDefault();
    console.log('Detail form:', formData);
  };

  return (
    <form
      onSubmit={handleSeekerRegister}
      className="space-y-4 bg-gray-50 py-20 mx-[200px] my-20 rounded-2xl"
    >
      <h1 className="text-4xl font-extrabold text-center text-red-700 mb-10 tracking-wide">
        Register to Receive Blood
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 px-[200px]">
        {/* Right Column */}
        <div className="space-y-4">
          <TextInput
            label="Full Name"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            required
          />
          <TextInput
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            required
          />
          <TextInput
            label="Phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
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
          <TextInput
            label="Volume (ml)"
            name="volume"
            type="number"
            placeholder="Enter required volume"
            value={formData.volume || ''}
            onChange={handleChange}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority || ''}
              onChange={handleChange}
              required
              className="w-full text-lg px-3 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-rose-200 transition"
            >
              <option value="">Select priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">Medium</option>
            </select>
          </div>
        </div>
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              required
              className="w-full px-3 text-lg py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-rose-200 transition"
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
            label="Hospital Address"
            name="address"
            placeholder="Enter hospital address"
            value={formData.hospital_address}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Type"
            name="type"
            placeholder="Enter blood component type"
            value={formData.type || ''}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Quantity"
            name="quantity"
            type="number"
            placeholder="Enter quantity"
            value={formData.quantity || ''}
            onChange={handleChange}
            required
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
