import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ForumImage from "../components/ForumImage";
import CommentSection from "../components/CommentSection";
import dayjs from "dayjs";
import {
  createPost,
  getForumPosts,
  searchForumPosts,
} from "../services/api/forumService";
import { createComment } from "../services/api/commentService";
import { useLocation } from "react-router-dom";
import { deleteComment } from "../services/api/commentService";

function Forum() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  //search
  const [keyword, setKeyword] = useState("");
  const [searchKey, setSearchKey] = useState("");

  //post
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const location = useLocation();

  // const token = localStorage.getItem("authToken");
  const a =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkdWljIiwic2NvcGUiOiJNRU1CRVIiLCJpc3MiOiJiZHNzLmNvbSIsImV4cCI6MTc0OTY1NTU3OSwiaWF0IjoxNzQ5NjUxOTc5LCJ1c2VySWQiOjM1LCJqdGkiOiIxNDI2NTg4ZC01YzM4LTQ3YzItYTY0YS1hZjdjN2U2MmViOTAifQ.qY3OQLKORsch6NmF2SH08f5aHhCBBfpY_ttOo7GCKTvQUbwvshc5yD6VEUxQgCLsz0TxVrUoGKR1KUc2VDfp6w";
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
        setError("");
      } catch (error) {
        if (error.response.data.code === 1015) setError("Not found posts");
        else setError("Error fetching posts. Please try again.");
      }
    };

    fetchPosts();
  }, [keyword]);

  // handle create post
  const handleCreatePost = async () => {
    //e.preventDefault();
    if (!newPost.title || !newPost.content) {
      alert("Please enter both title and content.");
      return;
    }

    if (newPost.title.length > 100) {
      alert("Title must be less than 100 characters.");
      return;
    }

    if (newPost.content.length > 100) {
      alert("Content must be less than 100 characters.");
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
      alert("Please enter content.");
      return;
    }

    if (content.length > 100) {
      alert("Comment must be less than 100 characters.");
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

  // Check if the post form should be opened based on location state
  useEffect(() => {
    if (location.state?.openCreatePost) {
      setOpen(true);
    }
  }, [location.state]);

  //Function to wrap text at a specified length
  function wrapText(str, n) {
    if (!str) return "";
    return str.replace(new RegExp(`(.{1,${n}})`, "g"), "$1\n");
  }

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

  return (
    <>
      <Navbar mode="forum" />
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

      {error ? (
        <div className="flex justify-center min-h-[100vh]">
          <div className="text-center text-red-500 font-semibold my-4 text-lg mt-8">
            {error}
          </div>
        </div>
      ) : (
        posts.map((post, index) => (
          <div
            key={post.id || index}
            className=" mt-5 mb-8 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-[#FFA1A1] max-w-2xl mx-auto"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-white font-bold text-lg mr-3 shadow">
                {post.username?.charAt(0) || "U"}
              </div>
              <div>
                <span className="font-semibold text-cyan-300">
                  {post.username}
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  {post.updated_at && post.updated_at !== post.created_at ? (
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
        ))
      )}
    </>
  );
}

export default Forum;
