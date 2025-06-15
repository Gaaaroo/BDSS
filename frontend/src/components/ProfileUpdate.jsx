import React, { useState } from 'react';
import MapSelector from './MapSelector';
import { updateUserProfile } from '../services/api/userService';
import { storage } from '../services/api/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useApp } from '../Contexts/AppContext';

export default function ProfileUpdate({
  initialData,
  onCancel,
  onSaveSuccess,
}) {
  const { saveProfile } = useApp(); //lấy hàm setProfile từ context
  const [formData, setFormData] = useState({ ...initialData });
  const [uploading, setUploading] = useState(false);
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
      setFormData((prev) => ({ ...prev, image_link: downloadUrl }));
    } catch (error) {
      console.error('Upload image failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUserProfile(formData);
      console.log(res.data);
      saveProfile(res.data);
      onSaveSuccess();
    } catch (error) {
      console.error('Cập nhật thất bại:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl font-sans">
      <h2 className="text-2xl font-bold text-red-700 mb-6">Cập nhật hồ sơ</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              name="username"
              value={formData.username || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              type="password"
              className="input"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              name="full_name"
              value={formData.full_name || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
              className="input"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Date of Birth</label>
            <input
              name="dob"
              type="date"
              value={formData.dob || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <input
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Blood Type</label>
            <select
              name="blood_type"
              value={formData.blood_type || ''}
              onChange={handleChange}
              className="input"
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
            <label className="block font-medium mb-1">Image Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="block w-full text-sm text-gray-700"
            />
            {uploading && (
              <div className="text-sm text-gray-500">Đang tải ảnh...</div>
            )}
            {formData.image_link && (
              <img
                src={formData.image_link}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded-full border"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">
            Địa chỉ (chọn trên bản đồ)
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
            Hủy
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            {uploading ? 'Đang tải...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  );
}
