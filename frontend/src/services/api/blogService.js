import axiosClient from './axiosClient';

export const getAllBlogs = async (page = 0, size = 6) => {
  try {
    const response = await axiosClient.get(`/blog?page=${page}&size=${size}`);
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách blog:', error);
    throw error;
  }
};

export const getTop3Blogs = async () => {
  try {
    const response = await axiosClient.get('blog/top3');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy top 3 blog:', error);
    throw error;
  }
};

export const getMyBlogs = async () => {
  try {
    const response = await axiosClient.get('/blog/myBlog');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy blog của tôi:', error);
    throw error;
  }
};

export const addBlog = async (blogData) => {
  try {
    const response = await axiosClient.post('/blog', blogData);
    return response;
  } catch (error) {
    console.error('Lỗi khi thêm blog:', error);
    throw error;
  }
};

export const updateBlog = async (blogId, blogData) => {
  try {
    const response = await axiosClient.put(`/blog/${blogId}`, blogData);
    return response;
  } catch (error) {
    console.error(`Lỗi khi cập nhật blog ID ${blogId}:`, error);
    throw error;
  }
};

export const searchBlogByUsername = async (username, page = 0, size = 6) => {
  try {
    const response = await axiosClient.get(
      `/blog/search?page=${page}&size=${size}&username=${username}`
    );
    return response;
  } catch (error) {
    console.error(`Lỗi khi tìm blog theo username "${username}":`, error);
    throw error;
  }
};

export const deleteBlog = async (blogId) => {
  try {
    const response = await axiosClient.delete(`/blog/${blogId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi xóa blog ID ${blogId}:`, error.response || error);
    throw error;
  }
};
