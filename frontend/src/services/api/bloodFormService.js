import axiosClient from './axiosClient';
import React from 'react';

export const donorForm = async (donorFormData) => {
  try {
    const res = await axiosClient.post('/donateForm', donorFormData);
    console.log('Donor >>>', res);
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const receiveForm = async (receiveFormData) => {
  try {
    const res = await axiosClient.post('/receiveForm', receiveFormData);
    console.log('Receive >>>', res);
    return res;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
