import React, { useState } from "react";
import dayjs from "dayjs";
import { BiTrash, BiEdit } from "react-icons/bi";

export default function CommentSection({ comments, handleAddComment, handleDeleteComment }) {
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

  //Function to wrap text at a specified length
  function wrapText(str, n) {
    if (!str) return "";
    return str.replace(new RegExp(`(.{1,${n}})`, "g"), "$1\n");
  }



  return (
    <div className="mt-4">
      <div className="flex mb-2">
        <input
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          placeholder="Give your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="ml-2 px-3 py-2 bg-cyan-600 text-white rounded"
          onClick={handleSendComment}
        >
          Comment
        </button>
      </div>
      <div>
        {comments.map(
          (c, index) => (
            console.log(c),
            (
              <div
                key={c.comment_id || index}
                className="mb-1 text-sm text-gray-200 flex justify-between items-center"
              >
                <span>
                  <span className="font-semibold text-cyan-300">
                    {c.username}:
                  </span>{" "}
                  <span>{wrapText(c.content, 82)}</span>
                </span>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500">
                    {dayjs(c.created_at).format("HH:mm - DD/MM/YYYY")}
                  </span>
                  <button
                    className="ml-2 text-gray-400 hover:text-cyan-500"
                    title="Chỉnh sửa bình luận"
                    //onClick={() => handleEditComment && handleEditComment(c.id)}
                  >
                    <BiEdit />
                  </button>
                  <button
                    className="ml-2 text-gray-400 hover:text-red-500"
                    title="Xóa bình luận"
                    onClick={() => handleDeleteComment(c.comment_id)}
                  >
                    <BiTrash />
                  </button>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
