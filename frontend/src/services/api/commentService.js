import axios from "axios";

const API_BASE_URL = "http://localhost:8080/bdss";

export const createComment = async (postData) => {
  const token = localStorage.getItem("authToken");
  const response = await axios.post(`${API_BASE_URL}/comment`, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response.data.data;
}

export const deleteComment = async (commentId) => {
  const token = localStorage.getItem("authToken");
  const response = await axios.delete(`${API_BASE_URL}/comment/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { comment_id: commentId },
    withCredentials: true,
  });

  return response.data;
}

