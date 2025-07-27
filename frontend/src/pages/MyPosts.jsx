import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CommentSection from '../components/CommentSection';
import dayjs from 'dayjs';
import {
  getMyPosts,
  deletePost,
  updatePost,
} from '../services/api/forumService';
import { Link } from 'react-router-dom';
import { BiTrash, BiEdit } from 'react-icons/bi';
import { deleteComment, createComment } from '../services/api/commentService';
import Footer from '../components/Footer';
import LoadingPage from '../components/LoadingPage';
import CustomModal from '../components/CustomModal';
import { toast } from 'react-toastify';
import { commentSchema } from '../Validations/postValidation';
import PostModal from '../components/PostModal';

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editData, setEditData] = useState({ title: '', content: '' });

  //confirm delete
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({
    postId: null,
    commentId: null,
  });
  const [deleteType, setDeleteType] = useState(''); // 'post' hoặc 'comment'

  // Animation: track which posts are visible (giống Forum)
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(2);

  // Get posts of current user
  useEffect(() => {
    const fetchMyPosts = async () => {
      setLoading(true);
      try {
        const data = await getMyPosts();
        const myPosts = data.map((post) => ({
          ...post,
          id: post.postId,
          comments: post.comments || [],
        }));
        setPosts(myPosts);
        setVisiblePosts([]);
        setVisibleCount(2);
        myPosts.forEach((_, idx) => {
          setTimeout(() => {
            setVisiblePosts((prev) => [...prev, idx]);
          }, idx * 350);
        });
      } catch (err) {
        setPosts([]);
      }
      setLoading(false);
    };
    fetchMyPosts();
  }, []);

  // Infinite scroll - tăng số lượng post khi cuộn gần cuối trang
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setVisibleCount((prev) => {
          const next = Math.min(prev + 2, posts.length);
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

  // Handle delete post
  const handleDeletePost = (postId) => {
    setDeleteTarget({ postId, commentId: null });
    setDeleteType('post');
    setShowModal(true);
  };

  // Handle edit post
  const handleEditPost = (postId) => {
    const post = posts.find((p) => p.id === postId);
    setEditingPost(post);
    setEditData({ title: post.title, content: post.content });
    setOpen(true);
  };

  // Handle add comment
  const handleAddComment = async (postId, content) => {
    try {
      await commentSchema.validate({ content });
      const newComment = await createComment({ content, postId: postId });
      setPosts((posts) =>
        posts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );
    } catch (error) {
      if (error.name === 'ValidationError') {
        toast.error(error.message);
      } else {
        toast.error('Failed to add comment!');
      }
    }
  };

  // Handle save edited post
  const handleClosePost = () => {
    setOpen(false);
    setEditingPost(null);
  };

  const handleUpdatePost = async () => {
    try {
      await updatePost(editingPost.id, {
        title: editData.title,
        content: editData.content,
      });
      setPosts(
        posts.map((p) =>
          p.id === editingPost.id
            ? { ...p, title: editData.title, content: editData.content }
            : p
        )
      );
      setOpen(false);
      setEditingPost(null);
    } catch (err) {
      alert('Cập nhật bài viết thất bại!');
    }
  };

  //Handle delete comment
  const handleDeleteComment = (postId, commentId) => {
    setDeleteTarget({ postId, commentId });
    setDeleteType('comment');
    setShowModal(true);
  };

  //handle confirm delete comment and post
  const handleConfirmDelete = async () => {
    try {
      if (deleteType === 'post') {
        await deletePost(deleteTarget.postId);
        setPosts(posts.filter((post) => post.id !== deleteTarget.postId));
      } else if (deleteType === 'comment') {
        await deleteComment(deleteTarget.commentId);
        setPosts((posts) =>
          posts.map((post) =>
            post.id === deleteTarget.postId
              ? {
                  ...post,
                  comments: post.comments.filter(
                    (c) => c.commentId !== deleteTarget.commentId
                  ),
                }
              : post
          )
        );
      }
    } catch (err) {
      toast.error('Failed to delete!');
    } finally {
      setShowModal(false);
      setDeleteTarget({ postId: null, commentId: null });
      setDeleteType('');
    }
  };

  //Function to wrap text at a specified length
  function wrapText(str, n) {
    if (!str) return '';
    return str.replace(new RegExp(`(.{1,${n}})`, 'g'), '$1\n');
  }

  return (
    <>
      <Navbar mode="my-posts" />
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto mt-8">
          <h2 className="text-5xl font-bold mb-6 text-center text-[#FFA1A1]">
            My Posts
          </h2>
          {loading ? (
            <LoadingPage />
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-400">
              You have no posts yet. Start sharing your thoughts&nbsp;
              <Link
                to={'/forum'}
                className="text-cyan-500 hover:underline font-semibold"
                state={{ openCreatePost: true }}
              >
                here
              </Link>
              !
            </div>
          ) : (
            <div className="max-w-full">
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
                          {post.updatedAt &&
                          post.updatedAt !== post.createdAt ? (
                            <>
                              Updated:{' '}
                              {dayjs(post.updatedAt).format(
                                'HH:mm - DD/MM/YYYY'
                              )}
                            </>
                          ) : (
                            dayjs(post.createdAt).format('HH:mm - DD/MM/YYYY')
                          )}
                        </span>
                      </div>
                      {/* Edit/Delete buttons */}
                      <button
                        className="ml-auto mr-2 text-[#FFA1A1] hover:text-[#F76C6C] text-xl"
                        title="Edit"
                        onClick={() => handleEditPost(post.id)}
                      >
                        <BiEdit />
                      </button>
                      <button
                        className="text-[#FFA1A1] hover:text-[#F76C6C] text-xl"
                        title="Delete"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <BiTrash />
                      </button>
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
                        comments={post.comments.reverse()}
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
        </div>
      </div>

      {open && (
        <PostModal
          open={open}
          title="Update Post"
          formData={editData}
          setFormData={setEditData}
          onClose={handleClosePost}
          onSubmit={handleUpdatePost}
          isUpdate
        />
      )}
      {showModal && (
        <CustomModal
          title="Confirm deletion"
          onCancel={() => {
            setShowModal(false);
            setDeleteTarget({ postId: null, commentId: null });
            setDeleteType('');
          }}
          onOk={handleConfirmDelete}
          okLable="Delete"
        >
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete this{' '}
            {deleteType === 'post' ? 'post' : 'comment'}?
          </p>
        </CustomModal>
      )}
      <Footer />
    </>
  );
}

export default MyPosts;
