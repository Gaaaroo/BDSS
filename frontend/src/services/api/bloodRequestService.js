import axiosClient from './axiosClient';

export const getAllBloodDonateRequests = async () => {
  const response = await axiosClient.get('/donate-form/all');
  return response;
};

export const getAllBloodReceiveRequests = async () => {
  try {
    const response = await axiosClient.get('/receive-form');
    return response;
  } catch (error) {
    console.error(
      error?.response?.message || 'Error fetching all blood receive requests'
    );
    throw error;
  }
};

//search blood donate requests
export const searchBloodDonateRequests = async (keyword) => {
  try {
    const response = await axiosClient.get('/donate-form/search', {
      params: { keyword },
    });
    return response;
  } catch (error) {
    console.error(
      error?.response?.message || 'Error searching blood donate requests'
    );
    throw error;
  }
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

/////////////////////////////--RECEIVE--/////////////////////////////////////

// count receive request by status
export const countReceiveRequestByStatus = async () => {
  try {
    const response = await axiosClient.get('/receive-form/count-by-status');
    return response;
  } catch (error) {
    console.error(
      error?.response?.message ||
        'Error fetching donate request count by status'
    );
    throw error;
  }
};

export const getReceiveRequestByStatus = async (status) => {
  try {
    const response = await axiosClient.get('/receive-form/by-status', {
      params: { status },
    });
    return response;
  } catch (error) {
    console.error(
      error?.response?.message || 'Error fetching receive request by status'
    );
    throw error;
  }
};

export const searchBloodReceiveRequests = async (keyword) => {
  try {
    const response = await axiosClient.get('/receive-form/search', {
      params: { keyword },
    });
    return response;
  } catch (error) {
    console.error(
      error?.response?.message || 'Error searching blood receive requests'
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
