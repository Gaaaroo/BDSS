import React from 'react';
import axiosClient from './axiosClient';
//Cout unit for blood card
export const countBloodUnit = async (type) => {
  try {
    const res = await axiosClient.get('/bloodUnit/countBloodUnit', {
      params: { bloodType: type },
    });
    console.log('count blood unit:', res, type);
    return res;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
  }
};

export const countBloodComponentUnit = async () => {
  try {
    const res = await axiosClient.get('/bloodComponentUnit/count/bloodType');
    return res;
  } catch (error) {
    console.error('Error fetching blood component counts by bloodType:', error);
  }
};

export const countRequest = async (type, componentType) => {
  try {
    const res = await axiosClient.get('/receive-form/count-request', {
      params: {
        bloodType: type,
        componentType,
      },
    });
    //console.log('count request:', res);
    return res;
  } catch (error) {
    console.error('Failed to count request:', error);
    return 0;
  }
};

export const bloodInventoryByType = async (type) => {
  try {
    const res = await axiosClient.get('bloodUnit/type', {
      params: { bloodType: type },
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log('error when list blood inventory by type', error);
  }
};

// Separate
export const separateBloodUnit = async (bloodId, components) => {
  try {
    const res = await axiosClient.post('bloodComponentUnit', {
      bloodId: bloodId,
      componentTypes: components,
    });
    console.log('Data send: ', res);
    return res;
  } catch (error) {
    console.log('error when separate blood: ', error);
  }
};

////////////////////
export const filterBloodUnits = async ({
  bloodType,
  statuses,
  fullName,
  page = 0,
  size = 10,
}) => {
  try {
    const params = {
      page,
      size,
    };

    if (bloodType) params.bloodType = bloodType;
    if (statuses && statuses.length > 0) params.statuses = statuses;
    if (fullName) params.fullName = fullName;

    console.log('filter params:', params);

    const res = await axiosClient.get('/bloodUnit/filter', { params });
    return res;
  } catch (error) {
    console.error('Error fetching filtered blood units:', error);
    throw error;
  }
};

export const filterBloodComponentUnits = async ({
  bloodType,
  statuses,
  fullName,
  page = 0,
  size = 10,
}) => {
  try {
    const params = {
      page,
      size,
    };

    if (bloodType) params.bloodType = bloodType;
    if (statuses && statuses.length > 0) params.statuses = statuses;
    if (fullName) params.fullName = fullName;

    console.log('filter component params:', params);

    const res = await axiosClient.get('/bloodComponentUnit/filter', { params });
    return res;
  } catch (error) {
    console.error('Error fetching filtered blood component units:', error);
    throw error;
  }
};
////////////////////////

export const countStoredBloodUnit = () => {
  try {
    const response = axiosClient.get('bloodUnit/count/by-blood-types');
    return response;
  } catch (error) {
    console.error('Error fetching stored blood unit count:', error);
    throw error;
  }
};
