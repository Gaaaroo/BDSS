import axiosClient from '../api/axiosClient';
import { signInWithPopup } from 'firebase/auth';
import { provider, auth } from './firebase';

export const login = async (form) => {
  try {
    const response = await axiosClient.post('/auth/login', form);
    const token = response.accessToken;
    const refreshToken = response.refreshToken;
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    // console.log('Login successful:', response);
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    console.error('Backend error details:', error.response?.data?.code);
    throw error;
  }
};

export const loginWithTokenGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // LẤY FIREBASE ID TOKEN
    const idToken = await user.getIdToken();
    // console.log('Firebase ID Token:', idToken);
    localStorage.setItem('firebaseToken', idToken);
    //GỬI TOKEN LÊN BACKEND
    const res = await axiosClient.post('/auth/loginWithTokenGoogle');
    console.log('Login with gg successfull', res);
    const token = res.accessToken;
    const refreshToken = res.refreshToken;
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    return res;
  } catch (error) {
    console.log('Error from login with GG: ', error);
    console.error('Backend error details:', error.response?.data?.code);
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axiosClient.post('/auth/register', userData);
    return response;
  } catch (error) {
    console.error('Backend error details:', error.response?.data?.code);
    console.error('Error registering user:', error);
    throw error;
  }
};

export const verifyOTP = async (otpData) => {
  try {
    const res = await axiosClient.post('/auth/verify', otpData);
    return res;
  } catch (err) {
    console.error('Backend error details:', err.response?.data?.code);
    throw (
      err.response?.data || { success: false, message: 'Error not defined!' }
    );
  }
};

export const resendOTP = async (resendOtpData) => {
  try {
    const res = await axiosClient.post('/auth/resend-otp', resendOtpData);
    return res;
  } catch (error) {
    console.log(error);
    console.error('Backend error details:', error.response?.data?.code);
    throw error;
  }
};

// Send password reset email
export const forgotPassword = async (email) => {
  try {
    const res = await axiosClient.post('/auth/forgot-password', email);
    console.log('res forgotPw: ', res);
    return res;
  } catch (error) {
    console.log('error when sent link email reset pw', error);
  }
};

//reset pw
export const resetPassword = async (token, newPassword) => {
  try {
    const res = await axiosClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return res;
  } catch (err) {
    console.log('error when reset pw: ', err);
    throw err;
  }
};
