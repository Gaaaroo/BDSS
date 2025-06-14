import axiosClient from './axiosClient';

export const createComment = async (postData) => {
  const response = await axiosClient.post('/comment', postData);
  return response.data.data;
};

export const deleteComment = async (commentId) => {
  const response = await axiosClient.delete('/comment/delete');
};
