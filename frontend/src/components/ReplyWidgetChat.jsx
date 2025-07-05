import { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import { db } from '../services/api/firebase';
import { onValue, push, ref, set, remove } from 'firebase/database';
import { Send } from 'lucide-react';
import { Scroll } from 'lucide-react';

function WidgetChatAdmin() {
  const [conversations, setConversations] = useState([]);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [adminName, setAdminName] = useState('Admin');
  const messagesEndRef = useRef(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  // Lấy danh sách các room
  useEffect(() => {
    const conversationsRef = ref(db, 'conversations');
    const unsubscribe = onValue(conversationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const conversationList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        conversationList.sort((a, b) => {
          if ((b.pinned ? 1 : 0) !== (a.pinned ? 1 : 0)) {
            return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
          }
          return b.date - a.date;
        });
        setConversations(conversationList);
      } else {
        setConversations([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Lấy tin nhắn của room đang chọn
  useEffect(() => {
    if (!selectedRoom?.id) {
      setMessages([]);
      return;
    }
    const messagesRef = ref(db, `conversations/${selectedRoom.id}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMessages(messageList);
        scrollToBottom();
      } else {
        setMessages([]);
      }
    });
    return () => unsubscribe();
  }, [selectedRoom]);

  // Gửi tin nhắn với tư cách admin
  const handleSendMessage = () => {
    if (!selectedRoom?.id || !message.trim()) return;
    const newMessage = {
      name: adminName,
      content: message,
      date: Date.now(),
    };
    push(ref(db, `conversations/${selectedRoom.id}/messages`), newMessage);
    setMessage('');
    scrollToBottom();
  };

  function splitByLength(str, n) {
    if (!str) return '';
    return str.match(new RegExp('.{1,' + n + '}', 'g')).join('\n');
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Hàm ghim (ví dụ: set một trường "pinned" = true)
  const handlePin = (conversationId) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    const newPinned = !conversation?.pinned;
    set(ref(db, `conversations/${conversationId}/pinned`), newPinned);
    setMenuOpenId(null);
  };

  // Hàm xóa đoạn chat
  const handleDelete = (conversationId) => {
    remove(ref(db, `conversations/${conversationId}`));
    setMenuOpenId(null);
    if (selectedRoom?.id === conversationId) setSelectedRoom(null);
  };

  return (
    <div className="flex w-full h-[100vh] max-h-[100vh] border-r overflow-y-auto bg-[#2e2e2e] ">
      {/* Sidebar: Danh sách các room */}
      <div
        className="w-[320px] h-[94vh] p-3 bg-[#1f1f1f] mt-[30px] ml-[30px] mr-[20px]
      rounded-[10px]"
      >
        <h2 className="font-bold mb-2 text-3xl pl-3 text-white mt-2">Inbox</h2>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`shadow-md rounded-md p-2 mb-2 cursor-pointer flex items-center justify-between hover:bg-[#3a3a3a] transition-colors duration-150 ${
              selectedRoom?.id === conversation.id ? 'bg-[#3a3a3a]' : ''
            }`}
            onClick={() => {
              setSelectedRoom(conversation);
              set(ref(db, `conversations/${conversation.id}/unread`), false);
            }}
          >
            {/* Thông tin bên trái */}
            <div className="flex-1 min-w-0 ">
              <h5 className="truncate text-[18px] font-semibold text-gray-200">
                {conversation.name}
              </h5>
              <p
                className={`text-sm truncate
    ${
      conversation.unread
        ? 'font-semibold text-[#e84a7a]'
        : 'font-normal text-gray-400'
    }`}
              >
                {conversation.lastMessage}
              </p>{' '}
              <span className="text-[10px] text-gray-400">
                {dayjs(conversation.date).format('HH:mm DD/MM/YYYY')}
              </span>
            </div>
            <div className="relative">
              {conversation.unread && (
                <span className="ml-2 text-[#e84a7a] text-4xl font-bold leading-none pb-2 flex items-center">
                  •
                </span>
              )}
            </div>
            {/* Icon 3 chấm bên phải */}
            <div className="relative">
              <button
                className="p-1 rounded-[50px] hover:bg-gray-200 ml-2 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId(conversation.id);
                }}
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="text-gray-500"
                  viewBox="0 0 20 20"
                >
                  <circle cx="10" cy="4" r="1.5" />
                  <circle cx="10" cy="10" r="1.5" />
                  <circle cx="10" cy="16" r="1.5" />
                </svg>
              </button>
              {menuOpenId === conversation.id && (
                <>
                  {/* Overlay để bắt sự kiện click ra ngoài */}
                  <div
                    className="fixed inset-0 z-0 "
                    onClick={() => setMenuOpenId(null)}
                    tabIndex={-1}
                  />
                  <div className="absolute right top mt-1 z-10 bg-white border rounded shadow-md min-w-[175px]">
                    <button
                      className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePin(conversation.id);
                      }}
                    >
                      {conversation.pinned
                        ? 'Unpin conversation'
                        : 'Pin conversation'}
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(conversation.id);
                      }}
                    >
                      Delete conversation
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Content: Chat của room đang chọn */}
      <div
        className="p-3 flex-1 flex flex-col justify-between max-h-[95vh] h-[94vh] 
      mt-[30px] rounded-[10px] mr-[30px] bg-[#1f1f1f]"
      >
        <div className="flex-1 overflow-y-auto ">
          {selectedRoom ? (
            messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`flex ${idx === 0 ? 'mt-3' : ''} ${
                  msg.name === adminName
                    ? 'justify-end pr-4'
                    : 'justify-start pl-4'
                } mb-2`}
              >
                <div
                  className={`rounded-[10px] py-2 px-4 max-w-[70%] break-words ${
                    msg.name === adminName
                      ? 'bg-gray-800 text-right text-white '
                      : 'bg-gray-100 text-left text-black'
                  } rounded-md`}
                >
                  <p className="whitespace-pre-line font-mono">
                    {splitByLength(msg.content, 30)}
                  </p>

                  <span className="text-xs text-gray-400">
                    {dayjs(msg.date).format('HH:mm DD/MM/YYYY')}
                  </span>
                </div>
                <div ref={messagesEndRef} />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 mt-10">
              Select an inbox to view and reply to messages
            </div>
          )}
        </div>
        {/* Input gửi tin nhắn */}
        {selectedRoom && (
          <div className="flex items-center mt-3">
            <input
              type="text"
              className="bg-[#3a3b3c] p-2 pl-4 pr-4 rounded-[50px] w-full text-white"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              className=" text-white p-2 rounded-md ml-2"
              onClick={handleSendMessage}
            >
              <Send size={25} className="mr-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WidgetChatAdmin;
