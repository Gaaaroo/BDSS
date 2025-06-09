import axios from "axios";

const API_BASE_URL = "http://localhost:8080/bdss";

export const createPost = async (token, postData) => {
  const response = await axios.post(`${API_BASE_URL}/forum`, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response.data.data;
}

export const getForumPosts = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/forum`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  
  return response.data.data;
};