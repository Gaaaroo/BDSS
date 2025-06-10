// src/services/userService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/bdss";

export const getUserProfile = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/users/myProfile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response.data.data;
};

// Cập nhật thông tin người dùng
export const updateUserProfile = async (updatedData, token) => {
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
