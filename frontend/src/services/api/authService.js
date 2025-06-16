import axiosClient from '../api/axiosClient';
import { signInWithPopup } from 'firebase/auth';
import { provider, auth } from './firebase';

export const login = async (form) => {
  try {
    const response = await axiosClient.post('/auth/login', form);
    const token = response.accessToken;
    const refreshToken = response.refreshToken;
    // const token = response.data.data.accessToken;
    // const refreshToken = response.data.data.refreshToken;
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    console.log('Login successful:', response);
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
  // throw { code: 1006, message: "OTP code does not exist" };
  try {
    const res = await axiosClient.post('/auth/verify', otpData);
    console.log('response >>>>', res);
    return res;
  } catch (err) {
    console.error('Verify OTP error:', err);
    console.error('Backend error details:', err.response?.data?.code);
    throw (
      err.response?.data || { success: false, message: 'Error not defined!' }
    );
  }
};

export const resendOTP = async (resendOtpData) => {
  try {
    const res = await axiosClient.post('/auth/resend-otp', resendOtpData);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
    console.error('Backend error details:', error.response?.data?.code);
    throw error;
  }
};
