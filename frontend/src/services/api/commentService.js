import axios from "axios";

const API_BASE_URL = "http://localhost:8080/bdss";

export const createComment = async (token, postData) => {
  const response = await axios.post(`${API_BASE_URL}/comment`, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response.data.data;
}

export const deleteComment = async (commentId) => {
    // const token = localStorage.getItem("accessToken");
  const token = token1; // Use the provided token for testing

  const response = await axios.delete(`${API_BASE_URL}/comment/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { comment_id: commentId },
    withCredentials: true,
  });

  return response.data;
}

const token1 = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkdWljIiwic2NvcGUiOiJNRU1CRVIiLCJpc3MiOiJiZHNzLmNvbSIsImV4cCI6MTc0OTY1NTU3OSwiaWF0IjoxNzQ5NjUxOTc5LCJ1c2VySWQiOjM1LCJqdGkiOiIxNDI2NTg4ZC01YzM4LTQ3YzItYTY0YS1hZjdjN2U2MmViOTAifQ.qY3OQLKORsch6NmF2SH08f5aHhCBBfpY_ttOo7GCKTvQUbwvshc5yD6VEUxQgCLsz0TxVrUoGKR1KUc2VDfp6w";
