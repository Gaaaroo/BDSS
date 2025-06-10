import React, { useState } from "react";
import MapSelector from "./MapSelector";
import { updateUserProfile } from "../services/api/userService";

export default function ProfileUpdate({
  initialData,
  token,
  onCancel,
  onSaveSuccess,
}) {
  const [formData, setFormData] = useState({ ...initialData });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData, token);
      onSaveSuccess();
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
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
              value={formData.username}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className="input"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
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
              value={formData.dob}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Blood Type</label>
            <input
              name="blood_type"
              value={formData.blood_type}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Image Link</label>
            <input
              name="image_link"
              value={formData.image_link}
              onChange={handleChange}
              className="input"
            />
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
            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
