import axiosClient from './axiosClient';
import React from 'react';

export const donorForm = async (donorFormData) => {
  try {
    const res = await axiosClient.post('/donate-form', donorFormData);
    console.log('Donor >>>', res);
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const receiveForm = async (receiveFormData) => {
  try {
    const res = await axiosClient.post('/receive-form', receiveFormData);
    console.log('Receive >>>', res);
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
// View history --------donateAdd commentMore actions
export const myDonate = async () => {
  try {
    const res = await axiosClient.get('/donate-form/myDonateForm');
    return res;
  } catch (error) {
    throw error;
  }
};

export const myDonateDetail = async (id) => {
  try {
    const res = await axiosClient.get('/donate-form/detail', {
      params: { id },
    });
    return res;
  } catch (error) {
    throw error;
  }
};

// View history --------receive
export const myReceive = async () => {
  try {
    const res = await axiosClient.get('/receive-form/myReceiveForm');
    return res;
  } catch (error) {
    throw error;
  }
};

export const myReceiveDetail = async (id) => {
  try {
    const res = await axiosClient.get('/receive-form/detail', {
      params: { id },
    });
    return res;
  } catch (error) {
    throw error;
  }
};
