import React, { useState } from 'react';
import dayjs from 'dayjs';
import { BiTrash } from 'react-icons/bi';
import { jwtDecode } from 'jwt-decode';
import { useApp } from '../Contexts/AppContext';
import { toast } from 'react-toastify';
import CustomModal from './CustomModal';

export default function CommentSection({
  comments,
  handleAddComment,
  handleDeleteComment,
  setShowLoginModal,
  showLoginModal,
}) {
  const { isLogged } = useApp();
  const [comment, setComment] = useState('');
  // const [showLoginModal, setShowLoginModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const { role, profile } = useApp();

  let currentUserId = null;
  const token = localStorage.getItem('authToken');
  if (token) {
    const decoded = jwtDecode(token);
    currentUserId = decoded.sub;
  }

  const handleSendComment = () => {
    if (comment.trim()) {
      handleAddComment(comment);
      setComment('');
    }
  };

  const handleKeyDown = (e) => {
    if (profile?.status === 'BANNED') {
      toast.error('You are banned from creating comments.');
      return;
    } else {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendComment();
      }
    }
  };

  function wrapText(str, n) {
    if (!str) return '';
    return str.replace(new RegExp(`(.{1,${n}})`, 'g'), '$1\n');
  }

  // Hiển thị 5 comment mới nhất, nhấn "Show more" sẽ hiện thêm 5
  const totalComments = comments.length;
  const startIdx =
    totalComments > visibleCount ? totalComments - visibleCount : 0;
  const visibleComments = comments.slice(startIdx);

  return (
    <div className="mt-4">
      {/* Input & button */}
      <div className="flex mb-2">
        <input
          className="flex-1 p-2 rounded bg-[#FFF0F0] text-[#A94442] placeholder-[#F76C6C] border border-[#FFA1A1] focus:outline-none"
          placeholder="Give your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="ml-2 px-3 py-2 bg-[#F76C6C] text-white rounded hover:bg-[#ff8989] transition duration-200"
          onClick={() => {
            if (!isLogged) {
              setShowLoginModal(true);
              return;
            }
            if (profile?.status === 'BANNED') {
              toast.error('You are banned from creating comments.');
              return;
            } else {
              handleSendComment();
            }
          }}
        >
          Comment
        </button>
      </div>

      {/* Comment list */}
      <div>
        {visibleComments.map((c, index) => (
          <div
            key={c.commentId || index}
            className="mb-1 text-sm text-[#A94442] flex justify-between items-center bg-[#FFF5F5] px-3 py-2 rounded border border-[#FFA1A1]/40"
          >
            <span className="flex-1 overflow-hidden">
              <span className="font-semibold text-[#F76C6C] mr-1">
                {c.username}:
              </span>
              <span className="w-[500px] break-words">
                {wrapText(c.content, 65)}
              </span>
            </span>
            <div className="flex items-center ml-2 shrink-0">
              <span className="text-xs text-[#C96F6F] w-[101px]">
                {dayjs(c.createdAt).format('HH:mm - DD/MM/YYYY')}
              </span>
              {String(c.userId) === String(currentUserId) ||
              role === 'STAFF' ? (
                <button
                  className="ml-2 text-[#F76C6C] hover:text-red-600 transition"
                  title="Delete"
                  onClick={() => handleDeleteComment(c.commentId)}
                >
                  <BiTrash size={16} />
                </button>
              ) : (
                <span
                  className="ml-2 inline-block"
                  style={{ width: 16, height: 16 }}
                ></span>
              )}
            </div>
          </div>
        ))}
        {totalComments > visibleCount && (
          <div className="flex justify-center mt-3">
            <button
              className="text-[#F76C6C] hover:underline text-sm font-semibold"
              onClick={() => setVisibleCount((prev) => prev + 5)}
            >
              Show more comments
            </button>
          </div>
        )}
      </div>
    
    </div>
  );
}
