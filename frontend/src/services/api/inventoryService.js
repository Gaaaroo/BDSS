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

// Whole: List all in 1 type : Click card -> change page ->
// Blood Type ----Type -----Volmue ----Owner ------Date Store -------Expiry date ------Status( can update) ----Detail( can view )
// After update status + Separate ...........Component page change, status change

// Updtate Status

//
