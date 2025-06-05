import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { db } from "../services/api/firebase";
import { onValue, push, ref, set } from "firebase/database";

function WidgetChatAdmin() {
  const [conversations, setConversations] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [adminName, setAdminName] = useState("Admin");

  // Lấy danh sách các room
  useEffect(() => {
    const conversationsRef = ref(db, "conversations");
    const unsubscribe = onValue(conversationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const conversationList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
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
    setMessage("");
  };

  function splitByLength(str, n) {
    if (!str) return "";
    return str.match(new RegExp(".{1," + n + "}", "g")).join("\n");
  }
  return (
    <div className="flex">
      {/* Sidebar: Danh sách các room */}
      <div className="w-[300px] p-3 border-r">
        <h2 className="font-bold mb-2">Inbox</h2>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`shadow-md rounded-md p-2 mb-2 cursor-pointer ${
              selectedRoom?.id === conversation.id ? "bg-cyan-300" : ""
            }`}
            onClick={() => setSelectedRoom(conversation)}
          >
            <h5>{conversation.name}</h5>
            <p className="text-sm text-gray-600">{conversation.lastMessage}</p>
            <span className="text-xs text-gray-400">
              {dayjs(conversation.date).format("DD/MM/YYYY HH:mm")}
            </span>
          </div>
        ))}
      </div>

      {/* Content: Chat của room đang chọn */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="flex-1 overflow-y-auto">
          {selectedRoom ? (
            messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`flex ${
                  msg.name === adminName ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`rounded-[10px] py-2 px-4 max-w-[70%] break-words ${
                    msg.name === adminName
                      ? "bg-blue-100 text-right"
                      : "bg-gray-100 text-left"
                  } rounded-md`}
                >
                  <h5 className="font-semibold text-[10px] text-left text-red-500">
                    {msg.name}
                  </h5>

                  <p className="whitespace-pre-line font-mono">
                    {splitByLength(msg.content, 30)}
                  </p>

                  <span className="text-xs text-gray-400">
                    {dayjs(msg.date).format("DD/MM/YYYY HH:mm")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 mt-10">
              Chọn một inbox để xem và trả lời tin nhắn
            </div>
          )}
        </div>
        {/* Input gửi tin nhắn */}
        {selectedRoom && (
          <div className="flex items-center mt-3">
            <input
              type="text"
              className="border-2 p-2 rounded-md w-full"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              className="bg-cyan-300 text-black p-2 rounded-md ml-2"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WidgetChatAdmin;
