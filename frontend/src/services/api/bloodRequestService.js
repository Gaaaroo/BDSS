import axiosClient from './axiosClient';

export const fetchAllRequests = async (
  keyword,
  status,
  page = 0,
  size = 10
) => {
  try {
    const response = await axiosClient.get('/donate-form', {
      params: { keyword, status, page, size },
    });
    return response;
  } catch (error) {
    console.error(
      error?.response?.message || 'Error fetching blood donation requests'
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


export const fetchAllSeekRequests = async (
  keyword,
  status,
  priority,
  sortField,
  sortDir,
  page = 0,
  size = 10
) => {
  try {
    const response = await axiosClient.get('/receive-form', {
      params: {
        keyword,
        status,
        priority,
        sortField,
        sortDir,
        page,
        size,
      },
    });
    return response;
  } catch (error) {
    console.error(
      error?.response?.message || 'Error fetching blood seek requests'
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

