import axiosClient from './axiosClient';
import React from 'react';

export const donorForm = async (donorFormData) => {
  try {
    const res = await axiosClient.post('/donateForm', donorFormData);
    console.log('>>>', res);
    return res.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const receiveForm = async (receiveFormData) => {
  try {
    const res = await axiosClient.post('/donateForm', receiveFormData);
    console.log('>>>', res);
    return res.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
