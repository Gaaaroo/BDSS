import axiosClient from './axiosClient';

export const getAllBlogs = async (page = 0, size = 6) => {
  const response = await axiosClient.get(`/blog?page=${page}&size=${size}`);
  return response;
};

export const getTop3Blogs = async () => {
  const response = await axiosClient.get('blog/top3');
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

export const searchBlogByUsername = async (username, page = 0, size = 6) => {
  const response = await axiosClient.get(
    `/blog/search?page=${page}&size=${size}&username=${username}`
  );
  return response;
};

export const deleteBlog = async (blogId) => {
  const response = await axiosClient.delete(`/blog/${blogId}`);
  return response;
};
