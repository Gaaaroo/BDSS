import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ForumImage from "../components/ForumImage";
import CommentSection from "../components/CommentSection";
import {
  createPost,
  getForumPosts,
  searchForumPosts,
} from "../services/api/forumService";
import { createComment } from "../services/api/commentService";

function Forum() {
  const [showPostModal, setShowPostModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  //search
  const [keyword, setKeyword] = useState("");
  const [searchKey, setSearchKey] = useState("");

  //post
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const a =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkdWljIiwic2NvcGUiOiJNRU1CRVIiLCJpc3MiOiJiZHNzLmNvbSIsImV4cCI6MTc0OTU3ODU5OCwiaWF0IjoxNzQ5NTc0OTk4LCJ1c2VySWQiOjM1LCJqdGkiOiJkZTUwYzkzYy00ZTU4LTRjYTktODZiNi1kNjg5NzAyYTcyZmEifQ._S7Cft2r4AwURZYxkl9UmFNd-sft25giP9acJ8pWCwsKVLr0odUSDGZF5nPsALqkFZQ4VaWVvLUddsnatve-VA";
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
            id: post.post_id,
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

  // handle create post
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
          id: post.post_id,
          comments: post.comments || [],
        }))
      );
      setError("");
    } catch (error) {
      setError("Post failed. Please try again.");
    }
  };

  // create comment for a post
  const handleAddComment = async (postId, content) => {
    if (!content) {
      setError("Please enter content.");
      return;
    }
    console.log("Adding comment to post:", postId, content);

    try {
      const token = a;
      await createComment(token, { content, post_id: postId });
      console.log(postId, content);
      let data;
      if (keyword.trim() === "") {
        data = await getForumPosts(token);
      } else {
        data = await searchForumPosts(token, keyword);
      }
      console.log("Comments fetched successfully", data);

      setPosts(
        data.map((post) => ({
          ...post,
          id: post.post_id,
          comments: post.comments || [],
        }))
      );
      setError("");
    } catch (error) {
      setError("Comment failed. Please try again.");
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

  return (
    <>
      <Navbar mode="login" />
      <ForumImage
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        handleSearch={handleSearch}
      />
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
      {posts.map(
        (post, index) => (
          console.log("Rendering post:", post),
          (
            <div
              key={post.id || index}
              className="mb-8 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-[#FFA1A1] max-w-2xl mx-auto"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-white font-bold text-lg mr-3 shadow">
                  {post.username?.charAt(0) || "U"}
                </div>
                <div>
                  <span className="font-semibold text-cyan-300">
                    {post.username}
                  </span>
                  <span className="ml-3 text-xs text-gray-400">
                    {post.created_at
                      ? new Date(post.created_at).toLocaleString("vi-VN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Unknown date"}
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
                  handleAddComment={(comment) =>
                    handleAddComment(post.id, comment)
                  }
                />
              </div>
            </div>
          )
        )
      )}
    </>
  );
}

export default Forum;
