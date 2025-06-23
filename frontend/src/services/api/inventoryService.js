import React from 'react';
import axiosClient from './axiosClient';

export const countBloodUnit = async (type) => {
  try {
    const res = await axiosClient.get(
      `/bloodUnit/countBloodUnit?bloodType=${encodeURIComponent(type)}`
    );
    return res;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
  }
};
