import axiosClient from './axiosClient';

export const createPost = async (postData) => {
  const response = await axiosClient.post('/forum', postData);
  return response;
};

export const getForumPosts = async () => {
  const response = await axiosClient.get('/forum');
  return response.reverse();
};

export const searchForumPosts = async (keyword) => {
  const response = await axiosClient.get('/forum/search', {
    params: { keyword },
  });
  return response.reverse();
};

export const getMyPosts = async () => {
  const response = await axiosClient.get('/forum/my-posts');
  return response.reverse();
};

export const deletePost = async (postId) => {
  const response = await axiosClient.delete('/forum/my-posts', {
    params: { postId: postId },
    withCredentials: true,
  });

  return response;
};

export const updatePost = async (postId, postData) => {
  const response = await axiosClient.put('/forum/my-posts/update', postData, {
    params: { postId: postId },
    withCredentials: true,
  });
  return response;
};
