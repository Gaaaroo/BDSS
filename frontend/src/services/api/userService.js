import axiosClient from './axiosClient';

export const sendInviteRequest = async (userId) => {
  try {
    if (!userId || isNaN(userId)) {
      throw new Error('Invalid userId');
    }
    // Đảm bảo userId là số
    const intUserId = Number(userId);
    const response = await axiosClient.post('/users/send-to-donor', null, {
      params: { userId: intUserId },
    });
    return response;
  } catch (error) {
    console.error(error?.response?.message || 'Error sending invite request');
    throw error;
  }
};

export const getUserProfile = async () => {
  //const token = localStorage.getItem('authToken');
  const response = await axiosClient.get('/users/myProfile');
  return response;
};

// Cập nhật thông tin người dùng
export const updateUserProfile = async (updatedData) => {
  try {
    //const token = localStorage.getItem('authToken');
    const response = await axiosClient.put(
      '/users/myProfile/update',
      updatedData
    );
    return response;
  } catch (error) {
    console.error(error?.response?.message || 'Error updating user profile');
    throw error;
  }
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

export const getAllUserProfile = async (
  page = 0,
  size = 10,
  searchTerm = ''
) => {
  try {
    const res = await axiosClient.get('/users', {
      params: {
        page,
        size,
        keyword: searchTerm,
      },
    });
    return res;
  } catch (err) {
    console.log('Error when getting all user profiles:', err);
  }
};

export const countAllUsers = async () => {
  try {
    const res = await axiosClient.get('/users/count-all');
    return res;
  } catch (err) {
    console.log('Error when counting all users:', err);
  }
};

export const banUser = async (userId) => {
  try {
    const res = await axiosClient.put('/users/ban-user', null, {
      params: { userId },
    });
    return res;
  } catch (err) {
    console.error('Error banning user:', err);
    throw err;
  }
};
