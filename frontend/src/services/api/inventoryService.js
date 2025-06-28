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

// Updtate Status
