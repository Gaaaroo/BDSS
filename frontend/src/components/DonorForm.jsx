import TextInput from './TextInput';
import { useEffect, useState } from 'react';
import { useApp } from '../Contexts/AppContext';
import React from 'react';
import { useNavigate } from 'react-router';
import { donorForm } from '../services/api/bloodFormService';
import CustomModal from './CustomModal';
import { toast } from 'react-toastify';
import { donorFormSchema } from '../Validations/formValidate';

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
  const [isDisabled, setIsDisabled] = useState(false);
  const [formError, setFormError] = useState({});

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
    readyDate: '',
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
    setFormError({});
    try {
      if (isDisabled) {
        return;
      } else {
        setIsDisabled(true);
        // Re-enable after 5 seconds
        setTimeout(() => {
          setIsDisabled(false);
        }, 5000);
      }
      await donorFormSchema.validate(formData, { abortEarly: false });
      await donorForm({
        healthNotes: formData.disease,
        readyDate: formData.readyDate,
      });
      toast.success('Register successful!');
      navigate('/');
    } catch (error) {
      // Nếu là lỗi validation của Yup
      if (error.inner) {
        const errors = {};
        error.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setFormError(errors);
        toast.error('Please fix the highlighted fields.');
        console.error('Validation errors:', errors);
        // Nếu là lỗi từ API response
      } else if (error.response && error.response.data) {
        const { code, message } = error.response.data;
        if (message) {
          toast.error(message);
        } else {
          toast.error('Register failed.');
        }
        console.error(`Error ${code}: ${message}`);
        // Nếu là lỗi không rõ nguồn gốc
      } else {
        toast.error('Register failed.');
        console.error(error);
      }
    }
  };

  return (
    <form
      onSubmit={handleDonorRegister}
      className="space-y-4 bg-gray-50 py-20 mx-[200px] my-20 rounded-2xl items-center"
    >
      <h1 className="text-4xl font-extrabold text-center text-red-700 mb-10 tracking-wide">
        Blood Donation Request
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 px-[150px]">
        {/* Left Column */}
        <div className="space-y-4">
          <TextInput
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            readOnly
          />
          <TextInput
            label="Date of Birth"
            name="dob"
            value={formData.dob}
            readOnly
          />
          <TextInput
            label="Phone"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            readOnly
          />
          <TextInput
            label="Blood Type"
            name="bloodType"
            value={formData.bloodType}
            readOnly
          />
          <TextInput
            label="Ready Date"
            name="readyDate"
            type="datetime-local"
            value={formData.readyDate}
            onChange={handleChange}
          />
          {formError.readyDate && (
            <p className="text-sm text-red-600 mt-1">{formError.readyDate}</p>
          )}
        </div>
        {/* Right Column */}
        <div className="space-y-4">
          <TextInput
            label="Gender"
            name="gender"
            value={formData.gender}
            readOnly
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            readOnly
          />
          <TextInput
            label="Address"
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            readOnly
          />
          <TextInput
            label="Any blood related disease"
            name="disease"
            placeholder="Specify if any"
            value={formData.disease}
            onChange={handleChange}
          />
          {formError.disease && (
            <p className="text-sm text-red-600 mt-1">{formError.disease}</p>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <button
          disabled={isDisabled}
          type="submit"
          className="px-5 py-1.5 text-xl text-white bg-red-700 font-bold border-2 border-red-700 hover:bg-red-500 hover:text-white transition"
        >
          Register
        </button>
      </div>
      {showModal && (
        <CustomModal
          title={'Update profile'}
          onCancel={handleCancel}
          onOk={handleConfirm}
        >
          <p className="text-gray-700 mb-6">
            Please update your profile before filling out the form.
          </p>
        </CustomModal>
      )}
    </form>
  );
}
