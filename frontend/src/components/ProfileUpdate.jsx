import React, { useState } from 'react';
import MapSelector from './MapSelector';
import { updateUserProfile } from '../services/api/userService';
import { storage } from '../services/api/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useApp } from '../Contexts/AppContext';
import { toast } from 'react-toastify';
import { updateProfileSchema } from '../Validations/profileValidation';
export default function ProfileUpdate({
  initialData,
  onCancel,
  onSaveSuccess,
}) {
  const { setProfile } = useApp(); //setProfile từ context
  const [formData, setFormData] = useState({ ...initialData });
  const [uploading, setUploading] = useState(false);
  //Specific input validation errors
  const [formError, setFormError] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      lat: location.lat,
      lng: location.lng,
      address: location.address,
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    const uniqueId = Date.now().toString(36);
    const imageRef = ref(storage, `profile-images/${uniqueId}-${file.name}`);
    setUploading(true);
    try {
      await uploadBytes(imageRef, file);
      const downloadUrl = await getDownloadURL(imageRef);
      setFormData((prev) => ({ ...prev, imageLink: downloadUrl }));
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfileSchema.validate(formData, { abortEarly: false });
      setFormError({});
      const res = await updateUserProfile(formData);
      toast.success('Profile updated successfully.');
      setProfile(res);
      onSaveSuccess();
    } catch (error) {
      // Trường hợp lỗi từ server (ví dụ username đã tồn tại)
      if (error.response && error.response.data) {
        const { code, message } = error.response.data;
        if (code === 1030) {
          setFormError((prev) => ({ ...prev, username: message }));
          toast.error(message);
        } else {
          toast.error(message || 'Failed to update profile.');
        }
      } else if (error.inner) {
        const errors = {};
        error.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setFormError(errors);
        toast.error('Please fix the highlighted fields.');
      } else {
        toast.error('Failed to update profile.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl font-sans">
      <h2 className="text-2xl font-bold text-red-700 mb-6">Update profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              name="username"
              value={formData.username || ''}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 w-[350px]"
            />
            {formError.username && (
              <p className="text-red-500 text-sm">{formError.username}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              type="password"
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 w-[350px]"
            />
            {formError.password && (
              <p className="text-red-500 text-sm">{formError.password}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              name="fullName"
              value={formData.fullName || ''}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 w-[350px]"
            />
            {formError.fullName && (
              <p className="text-red-500 text-sm">{formError.fullName}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Gender</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-500 border-gray-300 focus:ring-purple-400"
                />
                <span className="text-gray-700">Male</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-500 border-gray-300 focus:ring-purple-400"
                />
                <span className="text-gray-700">Female</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Date of Birth</label>
            <input
              name="dob"
              type="date"
              value={formData.dob || ''}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 w-[350px]"
            />
            {formError.dob && (
              <p className="text-red-500 text-sm">{formError.dob}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 w-[350px]"
            />
            {formError.email && (
              <p className="text-red-500 text-sm">{formError.email}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <input
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 w-[350px]"
            />
            {formError.phone && (
              <p className="text-red-500 text-sm">{formError.phone}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Blood Type</label>

            <select
              name="bloodType"
              value={formData.bloodType || ''}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 w-[350px]"
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
              <p className="text-red-500 text-sm">{formError.bloodType}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Image Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="block w-full text-sm text-gray-70 file:bg-gray-400 hover:file:bg-red-600 file:text-white file:p-1 file:cursor-pointer file:rounded-md"
            />
            {uploading && (
              <div className="text-sm text-gray-500">Loading images...</div>
            )}
            {formData.imageLink && (
              <img
                src={formData.imageLink}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded-full border"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">
            Address (Select on map)
          </label>
          <MapSelector
            initialLocation={{
              lat: formData.lat,
              lng: formData.lng,
              address: formData.address,
            }}
            onLocationSelect={handleLocationSelect}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-red-300 rounded-xl hover:bg-red-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            {uploading ? 'Loading...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
