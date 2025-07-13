import AxiosClient from './axiosClient';

// add volume of donate request
export const addBloodUnit = async (data) => {
  try {
    const response = await AxiosClient.post('/bloodUnit', data);
    return response;
  } catch (error) {
    console.error(error?.response?.message || 'Error adding blood unit');
    throw error;
  }
};

export const assignBloodUnitToReceiveForm = async ({
  bloodId,
  receiveId,
  componentType,
}) => {
  try {
    const response = await AxiosClient.post('/bloodUnit/assign', null, {
      params: {
        bloodId,
        receiveId,
        componentType,
      },
    });
    return response;
  } catch (error) {
    console.error(
      error?.response?.data?.message || 'Error assigning blood unit'
    );
    throw error;
  }
};
