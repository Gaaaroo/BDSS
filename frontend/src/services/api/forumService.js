import axios from "axios";

const API_BASE_URL = "http://localhost:8080/bdss";

export const createPost = async (postData) => {
  const token = localStorage.getItem("authToken");
  const response = await axios.post(`${API_BASE_URL}/forum`, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response.data.data;
};

export const getForumPosts = async () => {
  const token = localStorage.getItem("authToken");
  const response = await axios.get(`${API_BASE_URL}/forum`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response.data.data.reverse();
};

export const searchForumPosts = async (keyword) => {
  const token = localStorage.getItem("authToken");
  const response = await axios.get(`${API_BASE_URL}/forum/search`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { keyword },
    withCredentials: true,
  });

  return response.data.data.reverse();
};

export const getMyPosts = async (username) => {
  const token = localStorage.getItem("authToken");
  const response = await axios.get(`${API_BASE_URL}/forum/my-posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { username },
    withCredentials: true,
  });

  return response.data.data.reverse();
};

export const deletePost = async (postId) => {
  const token = localStorage.getItem("authToken");
  const response = await axios.delete(`${API_BASE_URL}/forum/my-posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { post_id: postId },
    withCredentials: true,
  });

  return response.data;
};

export const updatePost = async (postId, postData) => {
  const token = localStorage.getItem("authToken");
  const response = await axios.put(
    `${API_BASE_URL}/forum/my-posts/update`,
    postData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: { post_id: postId },
      withCredentials: true,
    }
  );
  return response.data;
};
