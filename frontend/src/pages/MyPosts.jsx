import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CommentSection from "../components/CommentSection";
import dayjs from "dayjs";
import {
  getMyPosts,
  deletePost,
  updatePost,
} from "../services/api/forumService";
import { Link } from "react-router-dom";
import { BiTrash, BiEdit } from "react-icons/bi";
import { deleteComment } from "../services/api/commentService";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editData, setEditData] = useState({ title: "", content: "" });

  // Lấy username từ localStorage hoặc token (giả sử đã lưu)
  //const username = localStorage.getItem("username");
  //const token = localStorage.getItem("authToken");
  const user = "duic";
  const a =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkdWljIiwic2NvcGUiOiJNRU1CRVIiLCJpc3MiOiJiZHNzLmNvbSIsImV4cCI6MTc0OTY1NTU3OSwiaWF0IjoxNzQ5NjUxOTc5LCJ1c2VySWQiOjM1LCJqdGkiOiIxNDI2NTg4ZC01YzM4LTQ3YzItYTY0YS1hZjdjN2U2MmViOTAifQ.qY3OQLKORsch6NmF2SH08f5aHhCBBfpY_ttOo7GCKTvQUbwvshc5yD6VEUxQgCLsz0TxVrUoGKR1KUc2VDfp6w";
  const token = a;
  const username = user;

  // Get posts of current user
  useEffect(() => {
    const fetchMyPosts = async () => {
      setLoading(true);
      try {
        const data = await getMyPosts(token, username);
        // Lọc bài viết của user hiện tại
        const myPosts = data.map((post) => ({
          ...post,
          id: post.post_id,
          comments: post.comments || [],
        }));
        setPosts(myPosts);
      } catch (err) {
        setPosts([]);
      }
      setLoading(false);
    };
    fetchMyPosts();
  }, [token, username]);

  // Handle delete post
  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(token, postId);
        setPosts(posts.filter((post) => post.id !== postId));
      } catch (err) {
        console.error("Failed to delete post:", err);
      }
    }
  };

  // Handle edit post
  const handleEditPost = (postId) => {
    const post = posts.find((p) => p.id === postId); //find post by id
    setEditingPost(post);
    setEditData({ title: post.title, content: post.content });
    setOpen(true);
  };

  // Handle save edited post
  const handleClosePost = () => {
    setOpen(false);
    setEditingPost(null);
  };

  const handleUpdatePost = async () => {
    try {
      await updatePost(token, editingPost.id, {
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
      alert("Cập nhật bài viết thất bại!");
    }
  };

  //Handle delete comment
  const handleDeleteComment = async (postId, commentId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      console.log("Deleting comment with ID:", commentId);
      try {
        await deleteComment(commentId);
        //Remove the comment from the comments array
        setPosts((posts) =>
          posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: post.comments.filter(
                    (c) => c.comment_id !== commentId
                  ),
                }
              : post
          )
        );
      } catch (err) {
        console.error("Failed to delete post:", err);
      }
    }
  };

  //Function to wrap text at a specified length
  function wrapText(str, n) {
    if (!str) return "";
    return str.replace(new RegExp(`(.{1,${n}})`, "g"), "$1\n");
  }


  return (
    <>
      <Navbar mode="my-posts" />
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#FFA1A1]">
            My Posts
          </h2>
          {loading ? (
            <div className="text-center text-gray-400">Đang tải...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-400">
              You have no posts yet. Start sharing your thoughts&nbsp;
              <Link
                to={"/forum"}
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
                  className="absolute top-3 right-12 text-gray-400 hover:text-cyan-500 text-2xl"
                  title="Cập nhật bài viết"
                  onClick={() => handleEditPost(post.id)}
                >
                  <BiEdit />
                </button>
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
                  title="Xóa bài viết"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <BiTrash />
                </button>
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-white font-bold text-lg mr-3 shadow">
                    {post.username?.charAt(0) || "U"}
                  </div>
                  <div>
                    <span className="font-semibold text-cyan-300">
                      {post.username}
                    </span>
                    <span className="ml-3 text-xs text-gray-500">
                      {post.updated_at &&
                      post.updated_at !== post.created_at ? (
                        <>
                          Update at:{" "}
                          {dayjs(post.updated_at).format("HH:mm - DD/MM/YYYY")}
                        </>
                      ) : (
                        dayjs(post.created_at).format("HH:mm - DD/MM/YYYY")
                      )}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#FFA1A1] mb-2">
                  {wrapText(post.title, 44)}
                </h3>
                <p className="text-white mb-4">{wrapText(post.title, 60)}</p>
                <div className="border-t border-[#FFA1A1] pt-3 mt-3">
                  <CommentSection
                    comments={post.comments}
                    handleDeleteComment={(commentId) =>
                      handleDeleteComment(post.id, commentId)
                    }
                    handleAddComment={() => {}}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 w-full">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
              <button
                className="absolute top-1 right-2 mr-1.5 text-gray-500 hover:text-red-500 text-2xl"
                onClick={handleClosePost}
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 text-center text-black">
                Update Post
              </h2>
              <input
                className="w-full mb-2 p-2 border rounded text-black"
                placeholder="Your title"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />
              <textarea
                className="w-full mb-2 p-2 border rounded text-black"
                placeholder="Your content"
                value={editData.content}
                onChange={(e) =>
                  setEditData({ ...editData, content: e.target.value })
                }
              />
              <div className="flex justify-center">
                <button
                  className="bg-[#FFA1A1] text-white px-4 py-2 rounded hover:scale-105
                  transition-all duration-300 hover:bg-red-600 flex items-center justify-center
                  font-bold mt-1.5"
                  onClick={handleUpdatePost}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default MyPosts;
