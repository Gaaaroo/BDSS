import axiosClient from '../api/axiosClient';
import React from 'react';
//Blood donate form
//count all
export const countAllDonors = async () => {
  try {
    const res = await axiosClient.get('/donate-form/count-all');
    console.log('count all donors', res);
    return res;
  } catch (error) {
    console.log('err count all', error);
  }
};
//count all blood donate forms by today
export const countDonorsToday = async () => {
  try {
    const res = axiosClient.get('/donate-form/count-by-today');
    return res;
  } catch (error) {
    console.log('err count today', error);
  }
};
//mode can be "day", "month", or "year"
export const getDonorsStatics = async () => {
  try {
    const res = axiosClient.get('/donate-form/get-statistics');
    return res;
  } catch (error) {
    console.log('err statics', error);
  }
};
//này đếm hết ko phân biệt status
export const conutByBloodType = async () => {
  try {
    const res = axiosClient.get('/donate-form/count-by-blood-type');
    return res;
  } catch (error) {
    console.log('err', error);
  }
};
//Còn 2 API
//get-statistics-between-dates
//count-today-by-blood-type

//Blood receive form
