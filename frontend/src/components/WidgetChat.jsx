import React, { useRef, useState, useEffect } from "react";
import { db } from "../services/api/firebase";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { onValue, push, ref, set } from "firebase/database";

export default function WidgetChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  // Handle sending a message

  const [message, setMessage] = useState([]);
  const [name, setName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState({});
  const [messages, setMessages] = useState([]);

  const [conversations, setConversation] = useState([
    {
      id: 1,
      name: "Alice",
      lastMessage: "Hello, how are you?",
      date: Date.now(),
      unread: false,
    },
  ]);

  //   const handleSend = () => {
  //     if (!input.trim()) return;
  //     const newMessages = [...messages, { from: "user", text: input.trim() }];
  //     setMessages(newMessages);
  //     setInput("");
  //     setTimeout(() => {
  //       setMessages((prev) => [
  //         ...prev,
  //         { from: "bot", text: "Hello! This is a sample reply." },
  //       ]);
  //       scrollToBottom();
  //     }, 1000);
  //     scrollToBottom();
  //   };

  const [roomId, setRoomId] = useState(() => {
    let id = localStorage.getItem("roomId");
    if (!id) {
      //   id = Date.now().toString();
      id = nanoid(5);
      localStorage.setItem("roomId", id);
    }
    return id;
  });

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
        console.log("Messages:", data);
        return () => unsubscribe();
      },
      [roomId]
    );

    return () => {
      unsubscribe();
    };
  }, [selectedRoom]);

  const handleSend = () => {
    try {
      if (!selectedRoom.id || !message.trim()) return;

      const newMessage = {
        name: name,
        content: message,
        date: Date.now(),
      };

      push(ref(db, `conversations/${roomId}/messages`), newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setMessage("");
  };

  // Handle Enter key to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Open the chat widget
  const handleOpenChat = () => {
    if (!selectedRoom.id) {
      // If no conversations exist, create a new one
      handleCreateConversation();
    }
    setOpen(true);
    scrollToBottom();
  };

  // Create a new conversation
  const handleCreateConversation = () => {
    try {
      const newConversation = {
        id: roomId,
        name: `User ${roomId}`,
        lastMessage: "",
        date: Date.now(),
        unread: false,
      };
      set(ref(db, "conversations/" + roomId), newConversation);
      setSelectedRoom(newConversation);
      console.log("Conversation created:", newConversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 flex flex-col z-50">
      {/* Chat bubble */}
      {!open && (
        <div
          className="w-14 h-14 bg-cyan-300 rounded-full flex items-center justify-center cursor-pointer text-3xl"
          onClick={handleOpenChat}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
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
            height: "70vh",
            maxHeight: "70vh",
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-[#FFA1A1] text-white rounded-t-md">
            <h3 className="m-0 text-lg">Chat with out staff</h3>
            <button
              className="bg-transparent border-none text-white cursor-pointer"
              onClick={() => setOpen(false)}
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
          <div className="flex-1 p-4 overflow-y-auto" style={{ minHeight: 0 }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex mb-3 ${
                  msg.name === name ? "justify-end" : ""
                }`}
              >
                <div
                  className={`rounded-[10px] py-2 px-4 max-w-[70%] break-words ${
                    msg.name === name
                      ? "bg-[#ffa3a3] text-white "
                      : "bg-orange-100 text-black"
                  } flex flex-col`}
                >
                  <span>{msg.content}</span>
                  <span className="text-xs text-gray-500 mt-1 self-end">
                    {dayjs(msg.date).format("DD/MM/YYYY HH:mm")}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
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
  );
}
