import TextInput from './TextInput';
import { useEffect, useState } from 'react';
import { useApp } from '../Contexts/AppContext';
import { useNavigate } from 'react-router';
import { receiveForm } from '../services/api/bloodFormService';
export default function SeekerForm() {
  const { profile } = useApp(); //lấy profile từ context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: 'abc',
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
    } else {
      alert('You need update your profile');
      navigate('/profile', { state: { flag: 'update' } });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSeekerRegister = async (e) => {
    e.preventDefault();
    await receiveForm({
      volume: formData.volume,
      blood_type: formData.bloodType,
      priority: formData.priority,
      component_type: formData.type,
      quantity: formData.quantity,
      hospital_address: formData.hospital_address,
    });
    console.log('Detail receive form:', formData);
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
            value={formData.fullName || ''}
            onChange={() => {}}
            disabled
            required
          />
          <TextInput
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob || ''}
            onChange={() => {}}
            disabled
            required
          />
          <TextInput
            label="Phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone || ''}
            onChange={() => {}}
            disabled
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Type
            </label>
            <select
              name="bloodType"
              value={formData.bloodType || ''}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Volume (ml)
            </label>
            <select
              name="volume"
              value={formData.volume || ''}
              onChange={handleChange}
              required
              className="w-full text-lg px-3 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-rose-200 transition"
            >
              <option value="">Select volume (ml)</option>
              <option value="350">350</option>
              <option value="400">400</option>
              <option value="450">450</option>
            </select>
          </div>
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
              value={formData.gender || ''}
              onChange={() => {}}
              disabled
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
            value={formData.email || ''}
            onChange={() => {}}
            disabled
            required
          />
          <TextInput
            label="Hospital Address"
            name="hospital_address"
            placeholder="Enter hospital address"
            value={formData.hospital_address || ''}
            onChange={handleChange}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              label="Type"
              name="type"
              value={formData.type || ''}
              onChange={handleChange}
              required
              className="w-full text-lg px-3 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-rose-200 transition"
            >
              <option value="">Select blood component type</option>
              <option value="Whole">Whole</option>
              <option value="RBC">RBC</option>
              <option value="Plasma">Plasma</option>
              <option value="Platelets">Platelets</option>
            </select>
          </div>
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
