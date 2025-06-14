import axiosClient from './axiosClient';

export const createPost = async (postData) => {
  const response = await axiosClient.post('/forum', postData);
  return response.data.data;
};

export const getForumPosts = async () => {
  const response = await axiosClient.get('/forum');
  return response.data.data.reverse();
};

export const searchForumPosts = async (keyword) => {
  const response = await axiosClient.get('/forum/search', {
    params: { keyword },
  });
  return response.data.data.reverse();
};

export const getMyPosts = async () => {
  const response = await axiosClient.get('/forum/my-posts');
  return response.data.data.reverse();
};

export const deletePost = async (postId) => {
  const response = await axiosClient.delete('/forum/my-posts', {
    params: { post_id: postId },
    withCredentials: true,
  });

  return response.data;
};

export const updatePost = async (postId, postData) => {
  const response = await axiosClient.put('/forum/my-posts/update', postData, {
    params: { post_id: postId },
    withCredentials: true,
  });
  return response.data;
};
