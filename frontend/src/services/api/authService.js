import React from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/bdss/auth";

export const login = async (form) => {
  try {
    const response = await axios.post(`${API_URL}/login`, form, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const token = response.data.data.token;
    localStorage.setItem("authToken", token);
    console.log("Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    console.error("Backend error response:", error.response?.data);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Backend error details:", error.response?.data);
    console.error("Error registering user:", error);
    throw error;
  }
};
