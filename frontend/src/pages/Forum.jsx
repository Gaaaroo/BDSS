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
import { createComment, deleteComment } from '../services/api/commentService';
import { deletePostByAdmin } from '../services/api/forumService';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import ErrorModal from '../components/ErrorModal';
import CustomModal from '../components/CustomModal';
import PostModal from '../components/PostModal';
import { toast } from 'react-toastify';
import { commentSchema, postSchema } from '../Validations/postValidation';
import SearchForumPost from '../components/SearchForumPost';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import MiniForumStat from '../components/MiniForumStat';
import { BiTrash } from 'react-icons/bi';
import { useApp } from '../Contexts/AppContext';

function Forum() {
  const { isLogged } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({
    postId: null,
    commentId: null,
  });
  const [keyword, setKeyword] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [statReload, setStatReload] = useState(0);
  const [isCommenting, setIsCommenting] = useState(false);
  const location = useLocation();
  const { role, profile } = useApp();

  // Animation: track which posts are visible
  const [visiblePosts, setVisiblePosts] = useState([]);
  // Số lượng post hiển thị (infinite scroll)
  const [visibleCount, setVisibleCount] = useState(2);

  const handleSearch = () => setKeyword(searchKey);

  const handleDeletePostAdmin = async (postId) => {
    try {
      await deletePostByAdmin(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete post!');
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let data =
          keyword.trim() === ''
            ? await getForumPosts()
            : await searchForumPosts(keyword);
        setPosts(
          data.map((post) => ({
            ...post,
            id: post.postId,
            comments: post.comments || [],
          }))
        );
        // console.log('My posts:', data);

        setError('');
        setVisiblePosts([]);
        setVisibleCount(2);
        data.forEach((_, idx) => {
          setTimeout(() => {
            setVisiblePosts((prev) => [...prev, idx]);
          }, idx * 350);
        });
      } catch (error) {
        if (error.response?.data?.code === 1015) setError('Not found posts');
        else setError('Error fetching posts. Please try again.');
      }
    };
    fetchPosts();
  }, [keyword]);

  // Animate posts khi fetch mới, trừ khi đang comment
  useEffect(() => {
    if (isCommenting) {
      setIsCommenting(false);
      return;
    }
    setVisiblePosts([]);
    setVisibleCount(2);
    [0, 1].forEach((idx) => {
      setTimeout(() => {
        setVisiblePosts((prev) => [...prev, idx]);
      }, idx * 350);
    });
  }, [posts]);

  // Infinite scroll - tăng số lượng post khi cuộn gần cuối trang
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setVisibleCount((prev) => {
          const next = Math.min(prev + 2, posts.length);
          // Animate các post mới
          for (let i = prev; i < next; i++) {
            setTimeout(() => {
              setVisiblePosts((old) => {
                if (!old.includes(i)) return [...old, i];
                return old;
              });
            }, (i - prev) * 350);
          }
          return next;
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [posts.length]);

  const handleCreatePost = async () => {
    try {
      await postSchema.validate(newPost, { abortEarly: false });
      await createPost(newPost);
      setNewPost({ title: '', content: '' });
      setOpen(false);
      let data =
        keyword.trim() === ''
          ? await getForumPosts()
          : await searchForumPosts(keyword);
      setPosts(
        data.map((post) => ({
          ...post,
          id: post.postId,
          comments: post.comments || [],
        }))
      );
      setError('');
      setStatReload((prev) => prev + 1);
      setVisiblePosts([]);
      setVisibleCount(2);
      data.forEach((_, idx) => {
        setTimeout(() => {
          setVisiblePosts((prev) => [...prev, idx]);
        }, idx * 120);
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.errors.forEach((message) => toast.error(message));
      } else {
        setError('Post failed. Please try again.');
      }
    }
  };

  const handleAddComment = async (postId, content) => {
    try {
      setIsCommenting(true);
      await commentSchema.validate({ content });
      await createComment({ content, postId });
      let data =
        keyword.trim() === ''
          ? await getForumPosts()
          : await searchForumPosts(keyword);
      setPosts(
        data.map((post) => ({
          ...post,
          id: post.postId,
          comments: post.comments || [],
        }))
      );
      setError('');
      setStatReload((prev) => prev + 1);
      // Không reset visiblePosts, visibleCount => không hiệu ứng lại khi comment
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.errors.forEach((message) => toast.error(message));
      } else {
        setError('Comment failed. Please try again.');
      }
      setIsCommenting(false);
    }
  };

  const handleOpenPost = () => setOpen(true);
  const handleClosePost = () => setOpen(false);

  useEffect(() => {
    if (location.state?.openCreatePost) setOpen(true);
  }, [location.state]);

  function wrapText(str, n) {
    if (!str) return '';
    return str.replace(new RegExp(`(.{1,${n}})`, 'g'), '$1\n');
  }

  const handleDeleteComment = (postId, commentId) => {
    setDeleteTarget({ postId, commentId });
    setShowModal(true);
  };

  const handleConfirmDelete = async (postId, commentId) => {
    try {
      setIsCommenting(true);
      await deleteComment(commentId);
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
      setStatReload((prev) => prev + 1);
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      const backendCode = error?.response?.data?.code;
      setShowModal(false);
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

      {/* Mini stats bar */}
      <MiniForumStat reload={statReload} />

      <SearchForumPost
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        handleSearch={handleSearch}
      />

      {/* CTA Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => {
            if (profile.status === 'BANNED') {
              toast.error('You are banned from creating posts.');
              return;
            } else {
              handleOpenPost();
            }
          }}
          className="px-6 py-2 bg-gradient-to-br from-[#FFA1A1] to-[#F76C6C] text-white font-bold rounded-full shadow hover:scale-105 transition flex items-center gap-2"
        >
          <PencilSquareIcon className="w-6 h-6 text-white" />
          Share your story or ask for help
        </button>
      </div>

      <div className="fixed bottom-5 right-5 flex flex-col z-50">
        {!open && (
          <div
            className="w-14 h-14 bg-[#F76C6C] rounded-full flex items-center justify-center cursor-pointer text-3xl"
            onClick={() => {
              if (profile.status === 'ACTIVE') {
                toast.error('You are banned from creating posts.');
                return;
              } else {
                handleOpenPost();
              }
            }}
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

        {open ? (
          isLogged ? (
            <PostModal
              open={open}
              title="New post"
              formData={newPost}
              setFormData={setNewPost}
              onClose={handleClosePost}
              onSubmit={handleCreatePost}
            />
          ) : (
            <CustomModal
              onCancel={handleClosePost}
              onOk={() => navigate('/login')}
            >
              <p className="text-gray-700 mb-6">
                You must log in to create a post.
              </p>
            </CustomModal>
          )
        ) : null}
      </div>

      {error ? (
        <div className="flex justify-center min-h-[100vh]">
          <div className="text-center text-red-500 font-semibold my-4 text-lg mt-8">
            {error}
          </div>
        </div>
      ) : (
        <div className="max-w-full">
          {/* SỬA: chỉ render posts.slice(0, visibleCount) */}
          {posts.slice(0, visibleCount).map((post, index) => (
            <div
              key={post.id || index}
              className={`relative group mt-5 mb-8 p-0 max-w-2xl mx-auto
      transition-all duration-700 ease-out
      ${
        visiblePosts.includes(index)
          ? 'opacity-100 translate-y-0 scale-100 animate-slide-in-up'
          : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
      }
    `}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-[#F76C6C]/20 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none z-0"></div>

              {/* Post Card */}
              <div className="relative z-10 bg-[#FFF5F5] rounded-2xl p-6 border border-[#FFA1A1] shadow-md hover:shadow-lg transition-shadow duration-300">
                {/* Header */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#F76C6C] flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md border-2 border-white group-hover:scale-105 transition duration-200 overflow-hidden">
                    {post.imageLink ? (
                      <img
                        src={post.imageLink}
                        alt={post.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      post.username?.charAt(0) || 'U'
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-[#F76C6C] text-lg">
                      {post.username}
                    </span>
                    <span className="ml-3 left text-xs text-[#C96F6F]">
                      {post.updatedAt && post.updatedAt !== post.createdAt ? (
                        <>
                          Updated:{' '}
                          {dayjs(post.updatedAt).format('HH:mm - DD/MM/YYYY')}
                        </>
                      ) : (
                        dayjs(post.createdAt).format('HH:mm - DD/MM/YYYY')
                      )}
                    </span>
                  </div>
                  {role === 'STAFF' && (
                    <button
                      className="ml-auto text-[#FFA1A1] hover:text-[#F76C6C] text-xl"
                      title="Delete"
                      onClick={() => handleDeletePostAdmin(post.id)}
                    >
                      <BiTrash />
                    </button>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#F76C6C] mb-2 tracking-tight group-hover:underline transition-all duration-200">
                  {wrapText(post.title, 44)}
                </h3>

                {/* Content */}
                <p className="text-[#A94442] mb-4 text-base whitespace-pre-line leading-relaxed">
                  {wrapText(post.content, 60)}
                </p>

                {/* Comment section */}
                <div className="border-t border-[#FFA1A1] pt-4 mt-4">
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
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <CustomModal
          title="Confirm deletion"
          onCancel={() => setShowModal(false)}
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
