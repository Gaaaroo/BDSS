import React from 'react';
import axiosClient from './axiosClient';

export const getNotifications = async () => {
  try {
    const response = await axiosClient.get('/notification');
    return response;
  } catch (error) {
    console.error(error?.response?.message || 'Error fetching notifications');
    throw error;
  }
};

export const markRead = async (noticeId) => {
  try {
    const response = await axiosClient.post(
      `/notification/mark-read?noticeId=${noticeId}`
    );
    return response;
  } catch (error) {
    console.error(
      error?.response?.message || 'Error marking notification as read'
    );
    throw error;
  }
};

export const markRead1 = async (noticeId) => {
  try {
    const response = await axiosClient.post('/notification/mark-read', {
      params: { noticeId },
    });
    return response;
  } catch (error) {
    console.error(
      error?.response?.message || 'Error marking notification as read'
    );
    throw error;
  }
};
