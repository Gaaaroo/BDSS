import { set } from "firebase/database";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ForumImage from "../components/ForumImage";

function Forum() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [showPostModal, setShowPostModal] = useState(false);
  const [open, setOpen] = useState(false);

  // Lấy danh sách bài viết từ API khi load trang
  //   useEffect(() => {
  //     axios.get("/api/posts").then(res => setPosts(res.data));
  //   }, []);

  // Thêm bài viết mới
  const handleAddPost1 = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    const res = await axios.post("/api/posts", {
      ...newPost,
      author: "User",
    });
    setPosts([res.data, ...posts]);
    setNewPost({ title: "", content: "" });
  };

  const handleAddPost = () => {
    // Xử lý đăng bài ở đây
    setShowPostModal(false);
    setNewPost({ title: "", content: "" });
  };

  // Thêm comment cho bài viết
  const handleAddComment = async (postId, comment) => {
    const res = await axios.post(`/api/posts/${postId}/comments`, {
      author: "User",
      content: comment,
    });
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, res.data] }
          : post
      )
    );
  };

  // Open the chat widget
  const handleOpenChat = () => {
    setOpen(true);
  };

  // Close the chat widget
  const handleCloseChat = () => {
    setOpen(false);
  };

  return (
    <>
      <Navbar mode="login" />
      <ForumImage />
      <div className="fixed bottom-5 right-5 flex flex-col z-50">
        {!open && (
          <div
            className="w-14 h-14 bg-cyan-300 rounded-full flex items-center justify-center cursor-pointer text-3xl"
            onClick={handleOpenChat}
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
          <>
            {/* Overlay mờ nền */}
            <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-40"></div>
            {/* Khung modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
                  onClick={handleCloseChat}
                >
                  ×
                </button>
                <h2 className="text-xl font-bold mb-4">Đăng bài mới</h2>
                <input
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Tiêu đề"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                />
                <textarea
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Nội dung"
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                />
                <button
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
                  onClick={handleAddPost}
                >
                  Đăng bài
                </button>
              </div>
            </div>
          </>
        )}

        {/* Danh sách bài viết */}
        {posts.map((post) => (
          <div key={post.id} className="mb-6 p-4 bg-gray-900 rounded shadow">
            <h3 className="text-lg font-bold text-cyan-400">{post.title}</h3>
            <p className="text-white mb-2">{post.content}</p>
            <div className="text-xs text-gray-400 mb-2">
              {post.author} - {post.date}
            </div>
            {/* Comment */}
            <CommentSection
              comments={post.comments}
              onAdd={(comment) => handleAddComment(post.id, comment)}
            />
          </div>
        ))}
      </div>
    </>
  );
}

// Component comment cho từng bài viết
function CommentSection({ comments, onAdd }) {
  const [comment, setComment] = useState("");
  return (
    <div className="mt-2">
      <div className="flex mb-2">
        <input
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          placeholder="Viết bình luận..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="ml-2 px-3 py-2 bg-cyan-600 text-white rounded"
          onClick={() => {
            if (comment.trim()) {
              onAdd(comment);
              setComment("");
            }
          }}
        >
          Gửi
        </button>
      </div>
      <div>
        {comments.map((c) => (
          <div key={c.id} className="mb-1 text-sm text-gray-200">
            <span className="font-semibold text-cyan-300">{c.author}:</span>{" "}
            {c.content}
            <span className="ml-2 text-xs text-gray-500">{c.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forum;
