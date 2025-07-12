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

export const getNearbyUsersWithBloodType = async (
  lat,
  lng,
  radius = 5,
  bloodType = null
) => {
  const params = {
    lat,
    lng,
    radius,
  };

  if (bloodType) {
    params.bloodType = bloodType;
  }

  const response = await axiosClient.get('/users/nearby-with-bloodType', {
    params,
  });

  return response;
};

export const getAllUserProfile = async () => {
  try {
    const res = await axiosClient.get('/users');
    // console.log('User list: ', res);
    return res;
  } catch (err) {
    console.log('Error when get all userProfile:', err);
  }
};
