import React, { use, useEffect } from "react";
import { getPosts } from "../services/api";

export default function Posts() {
  const [posts, setPosts] = React.useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
        console.log("getPosts", data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <h1 className="bg-amber-300">Posts</h1>
      <div>
        {posts.map((post, index) => (
          <div key={index} className="border-2 border-black m-2 p-2">
            <h2 className="text-2xl font-bold">{post.title}</h2>
          </div>
        ))}
      </div>
    </>
  );
}
