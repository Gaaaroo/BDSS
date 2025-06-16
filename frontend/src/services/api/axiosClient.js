import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const apis = {
  loginWithTokenGoogle: '/auth/loginWithTokenGoogle',
  refreshToken: '/auth/refresh',
};

axiosClient.interceptors.request.use((config) => {
  let token = localStorage.getItem('authToken');

  if (config.url === apis.loginWithTokenGoogle) {
    token = localStorage.getItem('firebaseToken');
  }
  if (token && config.url !== apis.refreshToken) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle 401 and refresh token
const handleAuthError = async (error) => {
  const originalRequest = error.config;
  // Không retry nếu không có config (ví dụ lỗi CORS)
  if (!originalRequest || originalRequest.__isRetryRequest) {
    return Promise.reject(error);
  }

  // Gắn cờ để tránh retry vô hạn
  originalRequest.__isRetryRequest = true;
  // Nếu chưa từng retry, gán biến retryCount
  if (!originalRequest._retryCount) {
    originalRequest._retryCount = 0;
  }

  if (error.response.status === 401 && originalRequest._retryCount < 5) {
    originalRequest._retryCount += 1;

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return Promise.reject(error);
    }
    try {
      const res = await axiosClient.post(
        '/auth/refresh',
        {
          token: refreshToken,
        },
        { _retryCount: 3 }
      );
      const newAccessToken = res.accessToken;
      localStorage.setItem('authToken', newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosClient(originalRequest);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  return Promise.reject(error);
};

// Xử lý lỗi nghiệp vụ (code !== 1000)
const handleBusinessError = (response) => {
  const apiResponse = response.data;
  if (apiResponse.code !== 1000) {
    const error = new Error(apiResponse.message || 'Lỗi hệ thống');
    error.response = { data: apiResponse };
    throw error; // Đẩy vào catch
  }
  return apiResponse.data;
};

axiosClient.interceptors.response.use(handleBusinessError, handleAuthError);

export default axiosClient;
