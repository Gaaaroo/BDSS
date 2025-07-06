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

  // Get posts of current user
  useEffect(() => {
    const fetchMyPosts = async () => {
      setLoading(true);
      try {
        const data = await getMyPosts();
        // Lọc bài viết của user hiện tại
        const myPosts = data.map((post) => ({
          ...post,
          id: post.postId,
          comments: post.comments || [],
        }));
        setPosts(myPosts);
      } catch (err) {
        setPosts([]);
      }
      setLoading(false);
    };
    fetchMyPosts();
  }, []);

  // Handle delete post
  const handleDeletePost = (postId) => {
    setDeleteTarget({ postId, commentId: null });
    setDeleteType('post');
    setShowModal(true);
  };

  // Handle edit post
  const handleEditPost = (postId) => {
    const post = posts.find((p) => p.id === postId); //find post by id
    setEditingPost(post);
    setEditData({ title: post.title, content: post.content });
    setOpen(true);
  };

  // Handle add comment
  const handleAddComment = async (postId, content) => {
    try {
      // Validate input
      await commentSchema.validate({ content });
      // Gọi API tạo comment mới
      const newComment = await createComment({ content, postId: postId });
      // Cập nhật lại state posts để thêm comment mới vào đúng post
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
      console.log(editData);
      console.log(editingPost.id);
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
      console.error('Failed to delete:', err);
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
            posts.map((post) => (
              <div
                key={post.id}
                className="mb-8 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-[#FFA1A1] relative"
              >
                {/* Nút thùng rác Boxicon */}
                <button
                  className="absolute top-3 right-12 text-gray-400 hover:text-white text-2xl cursor-pointer"
                  title="Update"
                  onClick={() => handleEditPost(post.id)}
                >
                  <BiEdit />
                </button>
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl cursor-pointer"
                  title="Delete"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <BiTrash />
                </button>
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-white font-bold text-lg mr-3 shadow">
                    {post.username?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <span className="font-semibold text-cyan-300">
                      {post.username}
                    </span>
                    <span className="ml-3 text-xs text-gray-500">
                      {post.updated_at &&
                      post.updated_at !== post.created_at ? (
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
                    handleAddComment={(comment) => {
                      handleAddComment(post.id, comment);
                    }}
                  />
                </div>
              </div>
            ))
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
          onOk={() => {
            handleConfirmDelete(deleteTarget.postId, deleteTarget.commentId);
          }}
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
