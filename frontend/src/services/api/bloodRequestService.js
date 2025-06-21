import axiosClient from './axiosClient';

export const getAllBloodDonateRequests = async () => {
  const response = await axiosClient.get('/donate-form/all');
  return response;
};

export const getAllBloodReceiveRequests = async () => {
  const response = await axiosClient.get('/receive-form');
  return response.reverse();
};

export const searchBloodDonateRequests = async (keyword) => {
  const response = await axiosClient.get('/donate-form/search', {
    params: { keyword },
  });
  return response;
};

//update step of donation process
export const updateDonationProcessStep = async (stepData) => {
  const response = await axiosClient.put(
    '/donation-process/update-step',
    stepData
  );
  return response;
};

//get donate request by id
export const getDonateRequestById = async (donateId) => {
  const response = await axiosClient.get('/donate-form/detail', {
    params: { id: donateId },
  });
  return response;
};

// count donate request by status
export const countDonateRequestByStatus = async () => {
  try {
    const response = await axiosClient.get('/donate-form/count-by-status');
    return response;
  } catch (error) {
    console.error(
      error?.response?.message ||
        'Error fetching donate request count by status'
    );
    throw error;
  }
};

//get donate request by status
export const getDonateRequestByStatus = async (status) => {
  try {
    const response = await axiosClient.get('/donate-form/by-status', {
      params: { status },
    });
    return response;
  } catch (error) {
    console.error(
      error?.response?.message || 'Error fetching donate request by status'
    );
    throw error;
  }
};

// export const createPost = async (postData) => {
//   const response = await axiosClient.post('/forum', postData);
//   return response;
// };

// export const getForumPosts = async () => {
//   const response = await axiosClient.get('/forum');
//   return response.reverse();
// };

// export const searchForumPosts = async (keyword) => {
//   const response = await axiosClient.get('/forum/search', {
//     params: { keyword },
//   });
//   return response.reverse();
// };

// export const getMyPosts = async () => {
//   const response = await axiosClient.get('/forum/my-posts');
//   return response.reverse();
// };

// export const deletePost = async (postId) => {
//   const response = await axiosClient.delete('/forum/my-posts', {
//     params: { post_id: postId },
//     withCredentials: true,
//   });

//   return response;
// };
