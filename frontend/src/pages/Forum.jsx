import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ForumImage from '../components/ForumImage';
import CommentSection from '../components/CommentSection';
import dayjs from 'dayjs';
import {
  createPost,
  getForumPosts,
  searchForumPosts,
} from '../services/api/forumService';
import { createComment } from '../services/api/commentService';
import { useLocation } from 'react-router-dom';
import { deleteComment } from '../services/api/commentService';
import Footer from '../components/Footer';
import ErrorModal from '../components/ErrorModal';
import CustomModal from '../components/CustomModal';
import PostModal from '../components/PostModal';
import { toast } from 'react-toastify';
import { commentSchema, postSchema } from '../Validations/postValidation';

function Forum() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });
  //confirm delete
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({
    postId: null,
    commentId: null,
  });
  //search
  const [keyword, setKeyword] = useState('');
  const [searchKey, setSearchKey] = useState('');

  //post
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const location = useLocation();

  // const token = localStorage.getItem("authToken");
  ////
  // Lấy danh sách bài viết từ API khi load trang
  //   useEffect(() => {
  //     axios.get("/api/posts").then(res => setPosts(res.data));
  //   }, []);

  // Gọi API lấy dữ liệu user khi component mount

  // setKeyword to search
  const handleSearch = () => {
    setKeyword(searchKey);
  };

  // view all posts and search posts by keyword
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // console.log('Search keyword:', keyword);
        let data;
        if (keyword.trim() === '') {
          data = await getForumPosts();
        } else {
          data = await searchForumPosts(keyword);
        }
        // setPosts(data);
        setPosts(
          data.map((post) => ({
            ...post,
            id: post.postId,
            comments: post.comments || [],
          }))
        );
        // console.log('Posts fetched successfully', data);
        setError('');
      } catch (error) {
        if (error.response.data.code === 1015) setError('Not found posts');
        else setError('Error fetching posts. Please try again.');
      }
    };

    fetchPosts();
  }, [keyword]);

  // handle create post
  const handleCreatePost = async () => {
    //e.preventDefault();

    try {
      await postSchema.validate(newPost, { abortEarly: false });
      await createPost(newPost);
      setNewPost({ title: '', content: '' });
      setOpen(false);
      let data;
      if (keyword.trim() === '') {
        data = await getForumPosts();
      } else {
        data = await searchForumPosts(keyword);
      }
      setPosts(
        data.map((post) => ({
          ...post,
          id: post.postId,
          comments: post.comments || [],
        }))
      );
      setError('');
    } catch (error) {
      console.log('err', error)
      if (error.name === 'ValidationError') {
        error.errors.forEach((message) => {
          toast.error(message);
        });
      } else {
        setError('Post failed. Please try again.');
      }
    }
  };

  // create comment for a post
  const handleAddComment = async (postId, content) => {
    // console.log('Adding comment to post:', postId, content);

    try {
      await commentSchema.validate({ content });
      await createComment({ content, postId: postId });
      // console.log(postId, content);
      let data;
      if (keyword.trim() === '') {
        data = await getForumPosts();
      } else {
        data = await searchForumPosts(keyword);
      }
      // console.log('Comments fetched successfully', data);

      setPosts(
        data.map((post) => ({
          ...post,
          id: post.postId,
          comments: post.comments || [],
        }))
      );
      setError('');
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.errors.forEach((message) => {
          toast.error(message);
        });
      } else {
        // console.error('Add comment error:', error);
        setError('Comment failed. Please try again.');
      }
    }
  };

  // Open the chat widget
  const handleOpenPost = () => {
    setOpen(true);
  };

  // Close the chat widget
  const handleClosePost = () => {
    setOpen(false);
  };

  // Check if the post form should be opened based on location state
  useEffect(() => {
    if (location.state?.openCreatePost) {
      setOpen(true);
    }
  }, [location.state]);

  //Function to wrap text at a specified length
  function wrapText(str, n) {
    if (!str) return '';
    return str.replace(new RegExp(`(.{1,${n}})`, 'g'), '$1\n');
  }

  //Handle delete comment

  const handleDeleteComment = (postId, commentId) => {
    setDeleteTarget({ postId, commentId });
    setShowModal(true);
  };

  const handleConfirmDelete = async (postId, commentId) => {
    try {
      await deleteComment(commentId);
      //Remove the comment from the comments array
      setPosts((posts) =>
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (c) => c.commentId !== commentId
                ),
              }
            : post
        )
      );
      setShowModal(false);
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      const backendCode = error?.response?.data?.code;
      setErrorModal({
        open: true,
        message: (
          <>
            {backendCode && (
              <div className="font-semibold text-red-500 pb-2">
                Error code: {backendCode}
              </div>
            )}
            <div>
              {backendMessage || 'Failed to delete comment. Please try again.'}
            </div>
          </>
        ),
      });
      console.log('DSMessage:', backendMessage);
      console.log('Code:', backendCode);
    }
  };

  return (
    <>
      <ErrorModal
        open={errorModal.open}
        message={errorModal.message}
        onClose={() => setErrorModal({ open: false, message: '' })}
      />
      <Navbar mode="forum" />
      <ForumImage
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        handleSearch={handleSearch}
      />
      <div className="fixed bottom-5 right-5 flex flex-col z-50 ">
        {!open && (
          <div
            className="w-14 h-14 bg-cyan-300 rounded-full flex items-center justify-center cursor-pointer text-3xl"
            onClick={handleOpenPost}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              +
              <path
                d="M12 5v14M5 12h14"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        {open && (
          <PostModal
            open={open}
            title="New post"
            formData={newPost}
            setFormData={setNewPost}
            onClose={handleClosePost}
            onSubmit={handleCreatePost}
          />
        )}
      </div>

      {error ? (
        <div className="flex justify-center min-h-[100vh]">
          <div className="text-center text-red-500 font-semibold my-4 text-lg mt-8">
            {error}
          </div>
        </div>
      ) : (
        <div className="max-w-full">
          {posts.map((post, index) => (
            <div
              key={post.id || index}
              className=" mt-5 mb-8 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-[#FFA1A1] max-w-2xl mx-auto "
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-white font-bold text-lg mr-3 shadow">
                  {post.username?.charAt(0) || 'U'}
                </div>
                <div>
                  <span className="font-semibold text-cyan-300">
                    {post.username}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {post.updated_at && post.updated_at !== post.created_at ? (
                      <>
                        Update at:{' '}
                        {dayjs(post.updated_at).format('HH:mm - DD/MM/YYYY')}
                      </>
                    ) : (
                      dayjs(post.created_at).format('HH:mm - DD/MM/YYYY')
                    )}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#FFA1A1] mb-2">
                {wrapText(post.title, 44)}
              </h3>
              <p className="text-white mb-4">{wrapText(post.content, 60)}</p>
              <div className="border-t border-[#FFA1A1] pt-3 mt-3">
                <CommentSection
                  comments={post.comments}
                  handleDeleteComment={(commentId) =>
                    handleDeleteComment(post.id, commentId)
                  }
                  handleAddComment={(comment) =>
                    handleAddComment(post.id, comment)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <CustomModal
          title="Confirm deletion"
          onCancel={() => {
            setShowModal(false);
          }}
          onOk={() =>
            handleConfirmDelete(deleteTarget.postId, deleteTarget.commentId)
          }
          okLable="Delete"
        >
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete this comment?
          </p>
        </CustomModal>
      )}
      <Footer />
    </>
  );
}

export default Forum;
