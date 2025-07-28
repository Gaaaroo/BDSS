import TextInput from './TextInput';
import { useEffect, useState } from 'react';
import { useApp } from '../Contexts/AppContext';
import { useNavigate } from 'react-router';
import { receiveForm } from '../services/api/bloodFormService';
import CustomModal from './CustomModal';
import { toast } from 'react-toastify';
import { seekerFormSchema } from '../Validations/formValidate';
export default function SeekerForm() {
  const { profile } = useApp(); //lấy profile từ context
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState({});

  const [isDisabled, setIsDisabled] = useState(false);

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
    hospitalAddress: '',
    requiredDate: '',
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
      await seekerFormSchema.validate(formData, { abortEarly: false });
      await receiveForm({
        volume: formData.volume,
        bloodType: formData.bloodType,
        priority: formData.priority,
        componentType: formData.type,
        quantity: formData.quantity,
        hospitalAddress: formData.hospitalAddress,
        requiredDate: formData.requiredDate,
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
      }

      // Nếu là lỗi từ API response
      else if (error.response && error.response.data) {
        const { code, message } = error.response.data;
        if (message) {
          toast.error(message);
        } else {
          toast.error('Register failed.');
        }
        console.error(`Error ${code}: ${message}`);
      }

      // Nếu là lỗi không rõ nguồn gốc
      else {
        toast.error('Register failed.');
        console.error(error);
      }
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
            readOnly
          />
          <TextInput
            label="Date of Birth"
            name="dob"
            value={formData.dob || ''}
            readOnly
          />
          <TextInput
            label="Phone"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone || ''}
            readOnly
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Type request
            </label>
            <select
              name="bloodType"
              value={formData.bloodType || ''}
              onChange={handleChange}
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
            {formError.bloodType && (
              <p className="text-sm text-red-600 mt-1">{formError.bloodType}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Volume (ml)
            </label>
            <select
              name="volume"
              value={formData.volume || ''}
              onChange={handleChange}
              className="w-full text-lg px-3 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-200 transition"
            >
              <option value="">Select volume (ml)</option>
              <option value="350">350</option>
              <option value="400">400</option>
              <option value="450">450</option>
            </select>
            {formError.volume && (
              <p className="text-sm text-red-600 mt-1">{formError.volume}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority || ''}
              onChange={handleChange}
              className="w-full text-lg px-3 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-200 transition"
            >
              <option value="">Select priority</option>
              <option value="Urgent">Urgent</option>
              <option value="Medium">Medium</option>
            </select>
            {formError.priority && (
              <p className="text-sm text-red-600 mt-1">{formError.priority}</p>
            )}
          </div>
        </div>
        {/* Left Column */}
        <div className="space-y-4">
          <TextInput
            label="Gender"
            name="gender"
            value={formData.gender || ''}
            readOnly
          />
          <TextInput
            label="Email"
            name="email"
            value={formData.email || ''}
            readOnly
          />
          <TextInput
            label="Hospital Address"
            name="hospitalAddress"
            placeholder="Enter hospital address"
            value={formData.hospitalAddress || ''}
            onChange={handleChange}
          />
          {formError.hospitalAddress && (
            <p className="text-sm text-red-600 mt-1">
              {formError.hospitalAddress}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Component Type request
            </label>
            <select
              label="Type"
              name="type"
              value={formData.type || ''}
              onChange={handleChange}
              className="w-full text-lg px-3 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-200 transition"
            >
              <option value="">Select blood component type</option>
              <option value="Whole">Whole</option>
              <option value="RBC">RBCs</option>
              <option value="Plasma">Plasma</option>
              <option value="Platelets">Platelets</option>
              <option value="Platelets">WBCs</option>
            </select>
            {formError.type && (
              <p className="text-sm text-red-600 mt-1">{formError.type}</p>
            )}
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
              className="w-full text-lg px-3 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-200 transition"
            >
              <option value="">Select blood component type</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            {formError.quantity && (
              <p className="text-sm text-red-600 mt-1">{formError.quantity}</p>
            )}
          </div>
          <TextInput
            label="Required Date"
            name="requiredDate"
            type="datetime-local"
            value={formData.requiredDate || ''}
            onChange={handleChange}
          />
          {formError.requiredDate && (
            <p className="text-sm text-red-600 mt-[-15px] ">
              {formError.requiredDate}
            </p>
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
