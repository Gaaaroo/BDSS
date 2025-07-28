import React, { useRef, useState, useEffect } from 'react';
import { db } from '../services/api/firebase';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { onValue, push, ref, set, remove } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../Contexts/AppContext';
import { toast } from 'react-toastify';

export default function WidgetChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Handle sending a message
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState({});
  const [messages, setMessages] = useState([]);

  // Require fullName
  const { profile, activeWidget, setActiveWidget } = useApp();

  const [requireName, setRequireName] = useState(false);
  const [tempName, setTempName] = useState('');

  // Get the user's name from localStorage or prompt
  const [roomId, setRoomId] = useState(() => {
    let id = localStorage.getItem('roomId');
    if (!id) {
      id = nanoid(5);
      localStorage.setItem('roomId', id);
    }
    return id;
  });

  useEffect(() => {
    if (activeWidget !== 'chat') {
      setOpen(false);
    }
  }, [activeWidget]);

  useEffect(() => {
    const conversationsRef = ref(db, `conversations/${roomId}`);

    const unsubscribe = onValue(conversationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSelectedRoom(data);
      }
    });
    return () => unsubscribe();
  }, [roomId]);

  // Listen for changes in the conversations
  useEffect(() => {
    if (!roomId) return;

    const messagesRef = ref(db, `conversations/${roomId}/messages`);

    const unsubscribe = onValue(
      messagesRef,
      (snapshot) => {
        // Unsubscribe logic if needed
        const data = snapshot.val();
        if (data) {
          const messageList = Object.keys(data).map((key) => {
            return {
              id: key,
              ...data[key],
            };
          });
          setMessages(messageList);
        } else {
          setMessages([]);
        }
        // console.log('Messages:', data);
        return () => unsubscribe();
      },
      [roomId]
    );

    return () => {
      unsubscribe();
    };
  }, [roomId]);

  // Create a new conversation
  const handleCreateConversation = (customName) => {
    try {
      const newConversation = {
        id: roomId,
        name: profile?.fullName || name || customName,
        lastMessage: '',
        date: Date.now(),
        unread: false,
      };
      set(ref(db, 'conversations/' + roomId), newConversation);
      setSelectedRoom(newConversation);
      console.log('Conversation created:', newConversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSend = () => {
    try {
      // 1. Nếu chưa có phòng chat hoặc ô nhập trống thì không gửi
      if (!selectedRoom.id || !message.trim()) return;

      // 2. Tạo object tin nhắn mới với tên, nội dung và thời gian gửi
      const newMessage = {
        name: profile?.fullName || name,
        userId: profile?.email || roomId,
        content: message,
        date: Date.now(),
      };

      // 3. Đẩy tin nhắn mới lên Firebase vào nhánh messages của room hiện tại
      push(ref(db, `conversations/${roomId}/messages`), newMessage);
      // Cập nhật unread status
      set(ref(db, `conversations/${roomId}/unread`), true);
      set(ref(db, `conversations/${roomId}/lastMessage`), message);
      set(ref(db, `conversations/${roomId}/date`), Date.now());
      // 4. Cập nhật state messages để hiển thị tin nhắn mới
      console.log('Message sent:', newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
    // 5. Sau khi gửi xong thì xóa nội dung ô nhập (reset input)
    setMessage('');
    scrollToBottom();
  };

  // Open the chat widget
  const handleOpenChat = (customName) => {
    if (!selectedRoom.id) {
      handleCreateConversation(customName);
    }
    if (!profile?.fullName && !(customName || name)) {
      setRequireName(true);
      return;
    }
    setOpen(true);
    setActiveWidget('chat'); // 👈 set active
    scrollToBottom();

    // Send an automatic message if no messages exist
    setTimeout(() => {
      if (messages.length === 0) {
        const autoMessage = {
          name: 'Admin',
          content: 'Hello! How can we help you?',
          date: Date.now(),
        };
        // Push autoMessage lên Firebase
        push(ref(db, `conversations/${roomId}/messages`), autoMessage);
      }
    }, 500);
  };

  // handle name submission
  const handleConfirmName = () => {
    const valid =
      tempName.trim().length >= 2 && !/[^a-zA-ZÀ-ỹ\s]/.test(tempName);
    if (!valid) {
      toast.warning(
        'The name must be at least 2 characters long and cannot contain special characters!'
      );
      return;
    }

    setName(tempName.trim());
    //close ask name
    setRequireName(false);
    //open chat
    setTempName('');

    setTimeout(() => {
      handleOpenChat(tempName.trim());
    }, 0);
  };

  // Reset state when logout
  useEffect(() => {
    if (!profile) {
      // Khi logout, reset toàn bộ state chat và tạo roomId mới cho guest
      setSelectedRoom({});
      setMessages([]);
      setName('');
      setRequireName(false);
      setTempName('');
      setOpen(false);

      // Tạo roomId mới cho guest
      const newId = nanoid(5);
      localStorage.setItem('roomId', newId);
      setRoomId(newId);
    }
  }, [profile]);

  //  xử lý NAME sau login
  useEffect(() => {
    // console.log('Profile changed:', profile);
    if (
      profile?.fullName &&
      selectedRoom.id &&
      selectedRoom.name !== profile.fullName
    ) {
      set(ref(db, `conversations/${roomId}/name`), profile.fullName);
      setSelectedRoom((prev) => ({ ...prev, name: profile.fullName }));
    }
  });

  const isMyMessage = (msg) => {
    const myId = profile?.email || roomId;
    return msg.userId === myId;
  };

  const handleCloseChat = () => {
    // Tìm auto-message
    const autoMessage = messages.find(
      (msg) =>
        msg.name === 'Admin' && msg.content === 'Hello! How can we help you?'
    );

    if (autoMessage) {
      // Xóa auto-message
      remove(ref(db, `conversations/${roomId}/messages/${autoMessage.id}`));
    }

    // Kiểm tra xem còn tin nhắn thực hay không
    const realMessages = messages.filter(
      (msg) =>
        !(
          msg.name === 'Admin' && msg.content === 'Hello! How can we help you?'
        ) && msg.name !== 'Auto-msg'
    );

    // Nếu không còn tin nhắn thực → xóa toàn bộ room
    if (selectedRoom.id && realMessages.length === 0) {
      remove(ref(db, `conversations/${roomId}`));
      setSelectedRoom({});
    }

    // Nếu user chưa login → xóa local roomId
    if (!profile) {
      localStorage.removeItem('roomId');
    }

    // 👇 Đóng UI chat và cập nhật context
    setOpen(false);
    setActiveWidget(null);
  };

  // Handle Enter key to send message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const navigate = useNavigate();

  return (
    <>
      {/* Modal nhập tên nếu chưa có tên */}
      {requireName && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
          onClick={() => setRequireName(false)} // Click outside to close modal
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center relative w-105"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
          >
            {/* X button to close modal */}
            <button
              className="absolute top-1 right-3 text-gray-400 hover:text-[#F76C6C] text-2xl font-bold"
              onClick={() => setRequireName(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="mb-2 mt-2 text-lg font-semibold text-[#F76C6C]">
              Please enter your name to start chatting
            </h3>
            <input
              type="text"
              className="border rounded px-3 py-2 mb-3 w-64 mt-4"
              placeholder="Your name..."
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmName()}
              autoFocus
            />
            <button
              className="bg-[#F76C6C] text-white px-4 py-1 mt-3 font-semibold
              rounded-[50px]"
              onClick={handleConfirmName}
            >
              Start chat
            </button>
          </div>
        </div>
      )}
      {!open && (
        <div className="fixed bottom-22.5 right-5 flex flex-col z-50">
          <div
            className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-400 transition"
            onClick={() => navigate('/forum')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {/* Đầu người giữa */}
              <circle
                cx="12"
                cy="8"
                r="3"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              {/* Đầu người trái */}
              <circle
                cx="6"
                cy="11"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Đầu người phải */}
              <circle
                cx="18"
                cy="11"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Thân người giữa */}
              <path
                d="M8 21v-2a4 4 0 018 0v2"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Thân người trái */}
              <path
                d="M2 21v-1.5a4 4 0 014-4h2"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              {/* Thân người phải */}
              <path
                d="M22 21v-1.5a4 4 0 00-4-4h-2"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>
      )}

      <div className="fixed bottom-5 right-5 flex flex-col z-50">
        {/* Chat bubble */}
        {!open && (
          <div
            className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center cursor-pointer text-3xl hover:bg-red-400 transition"
            onClick={() => handleOpenChat()} // Open chat widget
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
        )}

        {/* Chat popup */}
        {open && (
          <div
            className="absolute bottom-20 right-0 w-96 max-w-[95vw] bg-[#FFDEDE] rounded-md border border-[#FFDEDE]
          shadow-lg flex flex-col transition-all text-sm"
            style={{
              height: '70vh',
              maxHeight: '70vh',
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-[#FFA1A1] text-white rounded-t-md">
              <h3 className="m-0 text-lg">Chat with out staff</h3>
              <button
                className="bg-transparent border-none text-white cursor-pointer"
                onClick={handleCloseChat} // Close chat widget
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {/* Vẽ ấu X */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {/* Messages */}
            <div
              className="flex-1 p-4 overflow-y-auto"
              style={{ minHeight: 0 }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex mb-2 ${
                    isMyMessage(msg) ? 'justify-end' : ''
                  }`}
                >
                  <div
                    className={`rounded-[10px] py-[6px] px-4 max-w-[70%] break-words  ${
                      isMyMessage(msg)
                        ? 'bg-[#ffa3a3] text-white '
                        : 'bg-orange-100 text-black'
                    } flex flex-col`}
                  >
                    <span
                      className={`text-[9px] text-gray-500 mt-1 ${
                        isMyMessage(msg) ? 'self-end' : 'self-start'
                      }`}
                    >
                      {dayjs(msg.date).format('HH:mm - DD/MM/YYYY')}
                    </span>
                    <span>{msg.content}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
              <div className="w-full flex justify-end">
                {messages.length > 0 &&
                  isMyMessage(messages[messages.length - 1]) && (
                    <span
                      className={`flex flex-end text-[8px] mr-1
          ${
            selectedRoom.unread
              ? 'text-gray-500 font-normal'
              : 'text-black font-semibold'
          }
        `}
                    >
                      {selectedRoom.unread ? 'sent' : 'seen'}
                    </span>
                  )}
              </div>
            </div>

            <div className="p-4 border-t border-[#ff7b7b]">
              <div className="flex space-x-4 items-center">
                <input
                  type="text"
                  className="flex-1 border border-[#ff7b7b] rounded-md px-4 py-2 outline-none w-3/4 text-black"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                <button
                  className="bg-[#ffa3a3] text-black hover:bg-[#ff7b7b] rounded-md px-4 py-2 cursor-pointer"
                  onClick={handleSend}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
