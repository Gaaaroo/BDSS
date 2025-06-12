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

export const verifyOTP = async (otpData) => {
  // throw { code: 1006, message: "OTP code does not exist" };
  try {
    const res = await axios.post(`${API_URL}/verify`, otpData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("response >>>>", res);
    return res.data;
  } catch (err) {
    console.error("Verify OTP error:", err);

    throw (
      err.response?.data || { success: false, message: "Error not defined!" }
    );
  }
};

export const resendOTP = async (resendOtpData) => {
  try {
    const res = await axios.post(`${API_URL}/resend-otp`, resendOtpData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
