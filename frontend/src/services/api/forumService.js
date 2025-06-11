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

export const searchForumPosts = async (token, keyword) => {
  const response = await axios.get(`${API_BASE_URL}/forum/search`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { keyword },
    withCredentials: true,
  });

  return response.data.data;
}

export const getMyPosts = async (token, username) => {
  const response = await axios.get(`${API_BASE_URL}/forum/my-posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { username },
    withCredentials: true,
  });

  return response.data.data;
}
