import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com';

export const getPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};
// File này chỉ test thử
