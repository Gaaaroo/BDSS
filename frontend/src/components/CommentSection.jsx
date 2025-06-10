import React, { useState } from "react";

export default function CommentSection({ comments, handleAddComment }) {
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
                  handleAddComment(comment);
                  setComment("");
                }
              }}
            >
              Gửi
            </button>
          </div>
          <div>
            {comments.map((c, index) => (
              <div key={c.id || index} className="mb-1 text-sm text-gray-200">
                <span className="font-semibold text-cyan-300">{c.author}:</span>{" "}
                {c.content}
                <span className="ml-2 text-xs text-gray-500">{c.date}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }