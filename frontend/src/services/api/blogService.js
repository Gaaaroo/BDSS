import axiosClient from './axiosClient';

export const getAllBlogs = async () => {
  const response = await axiosClient.get('/blog');
  return response;
};

export const getMyBlogs = async () => {
  const response = await axiosClient.get('/blog/myBlog');
  return response;
};

export const addBlog = async (blogData) => {
  const response = await axiosClient.post('/blog', blogData);
  return response;
};

export const updateBlog = async (blogId, blogData) => {
  const response = await axiosClient.put(`/blog/${blogId}`, blogData);
  return response;
};
