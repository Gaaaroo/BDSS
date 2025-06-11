import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CommentSection from "../components/CommentSection";
import dayjs from "dayjs";
import { getMyPosts, deletePost } from "../services/api/forumService";
import { Link } from "react-router-dom";
import { BiTrash, BiEdit } from "react-icons/bi";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy username từ localStorage hoặc token (giả sử đã lưu)
  //const username = localStorage.getItem("username");
  //const token = localStorage.getItem("authToken");
  const user = "duic";
  const a =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkdWljIiwic2NvcGUiOiJNRU1CRVIiLCJpc3MiOiJiZHNzLmNvbSIsImV4cCI6MTc0OTY0MDMwNiwiaWF0IjoxNzQ5NjM2NzA2LCJ1c2VySWQiOjM1LCJqdGkiOiI2NTNkYTMwOS0xN2RmLTQ3MjEtODNlYi0zNTBiZDNhZWIxYTUifQ.wVjva2UqEUCNYCQIEdnUfTgVD8tkpQyl_yUJj1gjJagcXk1UWF_Z96nI53UUdpOpQ4PwGGPSr2pTx22rc2l5UQ";
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
                    <span className="ml-3 text-xs text-gray-400">
                      {dayjs(post.created_at).format("HH:mm - DD/MM/YYYY")}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#FFA1A1] mb-2">
                  {post.title}
                </h3>
                <p className="text-white mb-4">{post.content}</p>
                <div className="border-t border-[#FFA1A1] pt-3 mt-3">
                  <CommentSection
                    comments={post.comments}
                    handleAddComment={() => {}}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default MyPosts;
