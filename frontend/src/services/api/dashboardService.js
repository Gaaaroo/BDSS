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
export const getDonorsStatics = async (mode) => {
  try {
    const res = axiosClient.get('/donate-form/get-statistics', {
      params: { mode },
    });
    return res;
  } catch (error) {
    console.log('err statics', error);
  }
};
//này đếm hết ko phân biệt status
export const countDonorsByBloodType = async () => {
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
//count all
export const countAllReceive = async () => {
  try {
    const res = await axiosClient.get('/receive-form/count-all');
    console.log('count all donors', res);
    return res;
  } catch (error) {
    console.log('err count all', error);
  }
};
//today
export const countSeekersToday = async () => {
  try {
    const res = await axiosClient.get('/receive-form/count-by-today');
    console.log('count all donors', res);
    return res;
  } catch (error) {
    console.log('err count all', error);
  }
};

//DANH SÁCH TỔNG SỐ ĐƠN THEO LOẠI MÁU VÀ LOẠI THÀNH PHẦN
export const listReceiveByBloodTypeAndComponentType = async () => {
  try {
    const res = axiosClient.get('/receive-form/list-all');
    return res;
  } catch (error) {
    console.log('err count today', error);
  }
};

//mode can be "day", "month", or "year"
export const getReceiveStatics = async (mode) => {
  try {
    const res = axiosClient.get('/receive-form/get-statistics', {
      params: { mode },
    });
    return res;
  } catch (error) {
    console.log('err statics', error);
  }
};

//Còn lại
// count-by-date-between
// count-today-by-blood-type
