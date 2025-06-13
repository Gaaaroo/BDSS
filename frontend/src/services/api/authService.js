import React from "react";
import axios from "axios";
import axiosClient from "../api/axiosClient";
import { signInWithPopup } from "firebase/auth";
import { provider, auth } from "./firebase";

export const login = async (form) => {
  try {
    const response = await axiosClient.post("/auth/login", form, {});
    const token = response.data.data.accessToken;
    const refreshToken = response.data.data.refreshToken;
    localStorage.setItem("authToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    console.log("Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    console.error("Backend error response:", error.response?.data);
    throw error;
  }
};

export const loginWithTokenGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // LẤY FIREBASE ID TOKEN
    const idToken = await user.getIdToken();
    console.log("Firebase ID Token:", idToken);
    localStorage.setItem("firebaseToken", idToken);
    //GỬI TOKEN LÊN BACKEND
    const res = await axiosClient.post("/auth/loginWithTokenGoogle");
    console.log("Login with gg successfull", res.data);
    const token = res.data.data.accessToken;
    const refreshToken = res.data.data.refreshToken;
    localStorage.setItem("authToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    return res.data;
  } catch (error) {
    console.log("Error from login with GG: ", error);
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axiosClient.post("/auth/register", userData);
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
    const res = await axiosClient.post("/auth/verify", otpData);
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
    const res = await axiosClient.post("/auth/resend-otp", resendOtpData);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Add a request interceptor to attach the token
axiosClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// Add a response interceptor to handle 401 and refresh token
axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axiosClient.post("/auth/refresh", {
          token: refreshToken,
        });
        console.log("New token >>> ", res);
        const newToken = response.data.authToken;
        localStorage.setItem("authToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
