import React from "react";
import axios from "axios";

const API_URL = "http://localhost:8080";

export const login = async () => {
  try {
    const response = await axios.get(`${API_URL}/bdss/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/bdss/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
