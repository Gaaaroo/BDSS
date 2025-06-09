import { set } from "firebase/database";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ForumImage from "../components/ForumImage";
import {
  createPost,
  getForumPosts,
  searchForumPosts,
} from "../services/api/forumService";

function Forum() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [showPostModal, setShowPostModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const [keyword, setKeyword] = useState("");
  const [searchKey, setSearchKey] = useState("");

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({content: "", post_id: ""});

  const a =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkdWljIiwic2NvcGUiOiJNRU1CRVIiLCJpc3MiOiJiZHNzLmNvbSIsImV4cCI6MTc0OTQ3MjAyNSwiaWF0IjoxNzQ5NDY4NDI1LCJ1c2VySWQiOjM1LCJqdGkiOiI2ZjlhYWQ3NS1jYjIzLTRiOTAtOWRlOC0yZjBmMjI0ZWY2MjgifQ.utUSVa9K1AA5dDbpTq8JcEhk5ra_mdJnnFtRnQ52V70xBTgFWwljffBiScYU7GJaSpKBsBgkneZAS6Mohg3PWA";
  ////
  // Lấy danh sách bài viết từ API khi load trang
  //   useEffect(() => {
  //     axios.get("/api/posts").then(res => setPosts(res.data));
  //   }, []);

  // Gọi API lấy dữ liệu user khi component mount

  const handleSearch = () => {
    if (searchKey.trim() === "") {
      alert("Vui lòng nhập từ khóa tìm kiếm.");
      return;
    }
    setKeyword(searchKey)    
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = a;
        console.log("Search keyword:", keyword);
        let data;
        if (keyword.trim() === "") {
          data = await getForumPosts(token);
        } else {
          data = await searchForumPosts(token, keyword);
        }
        // setPosts(data);
        setPosts(
          data.map((post) => ({
            ...post,
            comments: post.comments || [],
          }))
        );
        console.log("Posts fetched successfully", data);
      } catch (error) {
        console.error("Error fetching posts", error);
      }
    };

    fetchPosts();
  }, [keyword]);

  //Handle create post
  const handleCreatePost = async () => {
    //e.preventDefault();
    if (!newPost.title || !newPost.content) {
      setError("Please enter both title and content.");
      return;
    }

    try {
      const token = a;
      await createPost(token, newPost);
      setNewPost({ title: "", content: "" });
      setOpen(false);
      let data;
      if (keyword.trim() === "") {
        data = await getForumPosts(token);
      } else {
        data = await searchForumPosts(token, keyword);
      }
      setPosts(
        data.map((post) => ({
          ...post,
          comments: post.comments || [],
        }))
      );
      setError("");
    } catch (error) {
      setError("Post failed. Please try again.");
    }
  };

  // // Thêm comment cho bài viết
  // const handleAddComment = async (postId, comment) => {
  //   const res = await axios.post(`/api/posts/${postId}/comments`, {
  //     author: "User",
  //     content: comment,
  //   });
  //   setPosts(
  //     posts.map((post) =>
  //       post.id === postId
  //         ? { ...post, comments: [...post.comments, res.data] }
  //         : post
  //     )
  //   );
  // };

  // Open the chat widget
  const handleOpenPost = () => {
    setOpen(true);
  };

  // Close the chat widget
  const handleClosePost = () => {
    setOpen(false);
  };

  return (
    <>
      <Navbar mode="login" />
      <ForumImage searchKey={searchKey} setSearchKey={setSearchKey} handleSearch={handleSearch} />
      <div className="fixed bottom-5 right-5 flex flex-col z-50">
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
          <>
            {/* Overlay mờ nền */}
            <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-40"></div>
            {/* Khung post */}
            <div className="fixed inset-0 flex items-center justify-center z-50 w-full]">
              <div
                className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative
              "
              >
                <button
                  className="absolute top-1 right-2 mr-1.5 text-gray-500 hover:text-red-500 text-2xl"
                  onClick={handleClosePost}
                >
                  ×
                </button>
                <h2 className="text-xl font-bold mb-4 text-center text-black">
                  New post
                </h2>
                <input
                  className="w-full mb-2 p-2 border rounded text-black"
                  placeholder="Your title"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                />
                <textarea
                  className="w-full mb-2 p-2 border rounded text-black"
                  placeholder="Your content"
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                />
                <div className="flex justify-center">
                  <button
                    className="bg-[#FFA1A1] text-white px-4 py-2 rounded hover:scale-105
                  transition-all duration-300 hover:bg-red-600 flex items-center justify-center
                  hover: font-bold mt-1.5"
                    onClick={handleCreatePost}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Danh sách bài viết */}
      {posts.map((post) => (
        <div
          key={post.id}
          className="mb-8 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-[#FFA1A1] max-w-2xl mx-auto"
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-white font-bold text-lg mr-3 shadow">
              {post.author?.charAt(0) || "U"}
            </div>
            <div>
              <span className="font-semibold text-cyan-300">{post.author}</span>
              <span className="ml-3 text-xs text-gray-400">{post.date}</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-[#FFA1A1] mb-2">
            {post.title}
          </h3>
          <p className="text-white mb-4">{post.content}</p>
          <div className="border-t border-[#FFA1A1] pt-3 mt-3">
            <CommentSection
              comments={post.comments}
              // onAdd={(comment) => handleAddComment(post.id, comment)}
            />
          </div>
        </div>
      ))}
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
