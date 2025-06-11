import React, { useState } from "react";
import dayjs from "dayjs";

export default function CommentSection({ comments, handleAddComment }) {
  const [comment, setComment] = useState("");

  const handleSendComment = () => {
    if (comment.trim()) {
      handleAddComment(comment);
      setComment("");
    }
  };

  //Handle Enter key to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  return (
    <div className="mt-">
      <div className="flex mb-2">
        <input
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          placeholder="Viết bình luận..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="ml-2 px-3 py-2 bg-cyan-600 text-white rounded"
          onClick={handleSendComment}
        >
          Gửi
        </button>
      </div>
      <div>
        {comments.map((c, index) => (
          <div key={c.id || index} className="mb-1 text-sm text-gray-200">
            <span className="font-semibold text-cyan-300">{c.username}:</span>{" "}
            {c.content}
            <span className="ml-2 text-xs text-gray-500">
              {dayjs(c.created_at).format("HH:mm - DD/MM/YYYY")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
