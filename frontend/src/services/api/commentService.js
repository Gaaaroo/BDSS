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



