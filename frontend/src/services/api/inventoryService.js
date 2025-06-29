import React from 'react';
import axiosClient from './axiosClient';
//Cout unit for blood card
export const countBloodUnit = async (type) => {
  try {
    const res = await axiosClient.get('/bloodUnit/countBloodUnit', {
      params: { bloodType: type },
    });
    return res;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
  }
};

// Whole: List all in 1 type : Click card -> change page ->
// Blood Type ----Type -----Volmue ----Owner ------Date Store -------Expiry date ------Status( can update) ----Detail( can view )
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

// update status after separate
export const updateBloodStatus = async (status, bloodId) => {
  try {
    const res = await axiosClient.post('bloodUnit/updateStatus', null, {
      params: { status: status, bloodId: bloodId },
    });
    console.log('p', params);
    console.log(res);
    return res;
  } catch (error) {
    console.log('error update after separate', error);
  }
};
// After update status + Separate ...........Component page change, status change

//Components list => Filter by type of components
//List all component A+
export const listBloodComponentUnits = async (page = 0, size = 10) => {
  try {
    const res = await axiosClient.get('bloodComponentUnit', {
      params: { page, size },
    });
    console.log('List blood components:', res);
    return res;
  } catch (error) {
    console.log('error update after separate', error);
  }
};

//List all component by type and status
export const listByTypeAndStatus = async (bloodType, sta) => {
  try {
    const res = await axiosClient.get('bloodComponentUnit/type-status', {
      params: { bloodType: bloodType, status: sta },
    });
    console.log('List blood components:', res);
    return res;
  } catch (error) {
    console.log('error update after separate', error);
  }
};

//Filter component by status + fullname (Không dùng)
export const filterByStatusAndFullName = async (
  statusList,
  fullName,
  page = 0,
  size = 10
) => {
  try {
    //Kiểm soát serialization, để không bị axios thêm [] vào key
    const params = new URLSearchParams();
    statusList.forEach((status) => {
      params.append('status', status);
    });
    params.append('fullName', fullName);
    params.append('page', page);
    params.append('size', size);

    const res = await axiosClient.get(
      'bloodComponentUnit/status/searchByFullName',
      { params }
    );

    return res;
  } catch (error) {
    console.error('Error when filtering:', error);
    throw error;
  }
};

//Filter component by status + blood type + fullname (dùng)
export const filterByTypeStatusAndFullName = async (
  bloodType,
  statusList,
  fullName,
  page = 0,
  size = 10
) => {
  try {
    const params = new URLSearchParams();

    statusList.forEach((status) => {
      params.append('status', status);
    });
    params.append('bloodType', bloodType);
    params.append('fullName', fullName);
    params.append('page', page);
    params.append('size', size);
    const res = await axiosClient.get(
      'bloodComponentUnit/type-status/searchByFullName',
      { params }
    );
    return res;
  } catch (error) {
    console.error('Error fetching by type, status and name:', error);
    throw error;
  }
};
