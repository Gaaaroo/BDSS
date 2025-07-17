import axiosClient from './axiosClient';

export const getAllBloodDonateRequests = async (page = 0, size = 10) => {
  try{
    const response = await axiosClient.get('/donate-form/all', {
      params: {
        page,
        size,
      },
    });
    return response;
  }catch (error) {
    console.error(
      error?.response?.message || 'Error fetching all blood donate requests'
    );
    throw error;
  }
};

export const getAllBloodReceiveRequests = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get('/receive-form/all', {
      params: {
        page,
        size,
      },
    });
    return response;
  } catch (error) {
    console.error(
      error?.response?.message || 'Error fetching all blood receive requests'
    );
    throw error;
  }
};

//search blood donate requests
export const searchBloodDonateRequests = async (keyword, page = 0, size) => {
  try {
    const response = await axiosClient.get('/donate-form/search', {
      params: { keyword, page, size },
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
  try {
    const response = await axiosClient.put(
      '/donation-process/update-step',
      stepData
    );
    return response;
  } catch (error) {
    console.error(
      error?.response?.message || 'Error updating donation process step'
    );
    throw error;
  }
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
export const getDonateRequestByStatus = async (status, page = 0, size) => {
  try {
    const response = await axiosClient.get('/donate-form/by-status', {
      params: { status, page, size },
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

// Find suitabe blood by receiveId
export const getSuitableBloodByReceiveId = async (
  receiveId,
  page = 0,
  size = 10
) => {
  try {
    const response = await axiosClient.get('/receive-form/suitable-blood', {
      params: {
        receiveId,
        page,
        size,
      },
    });
    return response;
  } catch (error) {
    console.error(
      error?.response?.data?.message || 'Error fetching suitable blood units'
    );
    throw error;
  }
};

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

//get donate request by status
export const getReceiveRequestByStatus = async (status, page = 0, size = 10) => {
  try {
    const response = await axiosClient.get('/receive-form/by-status', {
      params: { status, page, size },
    });
    return response;
  } catch (error) {
    console.error(
      error?.response?.message || 'Error fetching receive request by status'
    );
    throw error;
  }
};

//search blood receive requests by
export const searchBloodReceiveRequests = async (
  keyword,
  page = 0,
  size = 10
) => {
  try {
    const response = await axiosClient.get('/receive-form/search', {
      params: { keyword, page, size },
    });
    return response;
  } catch (error) {
    console.error(
      error?.response?.message || 'Error searching blood receive requests'
    );
    throw error;
  }
};

//update step of receiving process
export const updateReceivingProcessStep = async (stepData) => {
  try {
    const response = await axiosClient.put(
      '/receiving-process/update-step',
      stepData
    );
    return response;
  } catch (error) {
    console.error(
      error?.response?.message || 'Error updating receiving process step'
    );
    throw error;
  }
};

//get receive request by id
export const getReceiveRequestById = async (receiveId) => {
  const response = await axiosClient.get('/receive-form/detail', {
    params: { id: receiveId },
  });
  return response;
};

//get receive request by priority
export const getReceiveRequestByPriority = async (
  priority,
  status,
  page = 0,
  size = 10
) => {
  try {
    const response = await axiosClient.get('/receive-form/by-priority', {
      params: { priority, status, page, size },
    });
    return response;
  } catch (error) {
    console.error(
      error?.response?.message || 'Error fetching receive request by priority'
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
