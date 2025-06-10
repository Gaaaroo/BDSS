// src/services/userService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/bdss";

export const getUserProfile = async () => {
  const token = localStorage.getItem("authToken");
  const response = await axios.get(`${API_BASE_URL}/users/myProfile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response.data.data;
};

// Cập nhật thông tin người dùng
export const updateUserProfile = async (updatedData) => {
  const token = localStorage.getItem("authToken");
  const response = await axios.put(
    `${API_BASE_URL}/users/myProfile/update`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );

  return response.data;
};

export const getNearbyUsers = async (lat, lng, radius = 5) => {
  const token = localStorage.getItem("authToken");
  const response = await axios.get(`${API_BASE_URL}/users/nearby`, {
    params: {
      lat,
      lng,
      radius,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};
