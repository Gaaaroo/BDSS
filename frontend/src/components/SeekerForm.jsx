import TextInput from './TextInput';
import { useEffect, useState } from 'react';
import { useApp } from '../Contexts/AppContext';
import { useNavigate } from 'react-router';
import { receiveForm } from '../services/api/bloodFormService';
import CustomModal from './CustomModal';
import { toast } from 'react-toastify';
// import { seekerFormSchema } from '../Validations/formValidate';
export default function SeekerForm() {
  const { profile } = useApp(); //lấy profile từ context
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  // const [formErrors, setFormErrors] = useState({});
  const handleCancel = () => {
    setShowModal(false);
    navigate('/');
  };
  const handleConfirm = () => {
    navigate('/profile', {
      state: { flag: 'update', redirectTo: '/become-a-seeker' },
    });
  };
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
    hospitalAddress: '',
    // requiredDate: '',
  });
  function isProfileIncomplete(profile) {
    return (
      !profile.fullName ||
      !profile.phone ||
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
          gender: profile.gender,
          email: profile.email,
        });
      }
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSeekerRegister = async (e) => {
    e.preventDefault();
    try {
      // await seekerFormSchema.validate(formData, { abortEarly: false });

      const res = await receiveForm({
        volume: formData.volume,
        bloodType: formData.bloodType,
        priority: formData.priority,
        componentType: formData.type,
        quantity: formData.quantity,
        hospitalAddress: formData.hospitalAddress,
        // requiredDate: formData.requiredDate,
      });
      console.log('Detail receive form:', res);
      toast.success('Register successful!');
      navigate('/');
    } catch (error) {
      toast.error('Register failed');
    }
  };

  return (
    <form
      onSubmit={handleSeekerRegister}
      className="space-y-4 bg-gray-50 py-20 mx-[200px] my-20 rounded-2xl"
    >
      <h1 className="text-4xl font-extrabold text-center text-red-700 mb-10 tracking-wide">
        Blood Seeking Request
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 px-[200px]">
        {/* Right Column */}
        <div className="space-y-4">
          <TextInput
            label="Full Name"
            name="fullName"
            value={formData.fullName || ''}
            onChange={() => {}}
          />
          <TextInput
            label="Date of Birth"
            name="dob"
            value={formData.dob || ''}
            onChange={() => {}}
          />
          <TextInput
            label="Phone"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone || ''}
            onChange={() => {}}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Type request
            </label>
            <select
              name="bloodType"
              value={formData.bloodType || ''}
              onChange={handleChange}
              required
              className="w-full text-lg px-3 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-200 transition"
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
              className="w-full text-lg px-3 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-200 transition"
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
              className="w-full text-lg px-3 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-200 transition"
            >
              <option value="">Select priority</option>
              <option value="Urgent">Urgent</option>
              <option value="Medium">Medium</option>
            </select>
          </div>
        </div>
        {/* Left Column */}
        <div className="space-y-4">
          <TextInput
            label="Gender"
            name="gender"
            value={formData.gender || ''}
            onChange={() => {}}
            disabled
            required
          />
          <TextInput
            label="Email"
            name="email"
            value={formData.email || ''}
            onChange={() => {}}
          />
          <TextInput
            label="Hospital Address"
            name="hospitalAddress"
            placeholder="Enter hospital address"
            value={formData.hospitalAddress || ''}
            onChange={handleChange}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Component Type request
            </label>
            <select
              label="Type"
              name="type"
              value={formData.type || ''}
              onChange={handleChange}
              required
              className="w-full text-lg px-3 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-200 transition"
            >
              <option value="">Select blood component type</option>
              <option value="Whole">Whole</option>
              <option value="RBC">RBCs</option>
              <option value="Plasma">Plasma</option>
              <option value="Platelets">Platelets</option>
              <option value="Platelets">WBCs</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <select
              label="Quantity"
              name="quantity"
              value={formData.quantity || ''}
              onChange={handleChange}
              required
              className="w-full text-lg px-3 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-200 transition"
            >
              <option value="">Select blood component type</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          {/* <TextInput
            label="Required Date"
            name="requiredDate"
            type="date"
            value={formData.requiredDate || ''}
            onChange={handleChange}
          />
          {formErrors.requiredDate && (
            <p className="text-sm text-red-600 mt-1">
              {formErrors.requiredDate}
            </p>
          )} */}
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
