import axiosClient from './axiosClient';

export const getUserProfile = async () => {
  //const token = localStorage.getItem('authToken');
  const response = await axiosClient.get('/users/myProfile');
  return response;
};

// Cập nhật thông tin người dùng
export const updateUserProfile = async (updatedData) => {
  //const token = localStorage.getItem('authToken');
  const response = await axiosClient.put(
    '/users/myProfile/update',
    updatedData
  );
  return response;
};

export const getNearbyUsers = async (lat, lng, radius = 5) => {
  //const token = localStorage.getItem('authToken');
  const response = await axiosClient.get('/users/nearby', {
    params: {
      lat,
      lng,
      radius,
    },
  });
  return response;
};
