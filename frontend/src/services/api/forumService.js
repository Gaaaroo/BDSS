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

export const countAllUsers = async () => {
  try{
    const response = await axiosClient.get('/users/count-all');
    return response;
  }catch (error) {
    console.error(
      error?.response?.message || 'Error counting all users'
    );
    throw error;
  }
}

export const countAllComments = async () => {
  try{
    const response = await axiosClient.get('/comment/count-all');
    return response;
  }catch(error){
    console.error(
      error?.response?.message || 'Error counting all comments'
    );
    throw error;
  }
}

export const countAllPosts = async () => {
  try{
    const response = await axiosClient.get('/forum/count-all');
    return response;
  }catch(error){
    console.error(
      error?.response?.message || 'Error counting all posts'
    );
    throw error;
  }
}
