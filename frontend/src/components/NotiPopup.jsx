import { Bell } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { getNotifications, markRead } from '../services/api/notiService';

export default function NotiPopup({ setOpen, setUnreadCount }) {
  const [notifications, setNotifications] = useState([]);
  const popupRef = useRef(null);

  useEffect(() => {
    // Fetch notifications từ backend
    getNotifications().then(setNotifications);
  }, []);

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    setUnreadCount && setUnreadCount(unread);
  }, [notifications, setUnreadCount]);

  const handleMarkRead = async (noticeId) => {
    console.log('Notifications fetched:', notifications);

    try {
      await markRead(noticeId);
      setNotifications((prev) =>
        prev.map((noti) =>
          (noti.noticeId || noti.id) === noticeId
            ? { ...noti, read: true }
            : noti
        )
      );
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-transparent"
        onClick={() => setOpen(false)}
      />
      {/* Popup */}
      <div className="relative w-96 bg-white rounded-xl shadow-xl border border-red-200 p-0 overflow-hidden translate-x-[-60px] translate-y-[64px] z-10">
        <div className="px-5 py-4 border-b border-gray-100 bg-red-50">
          <div className="font-bold text-[25px] text-black flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" /> Notifications
          </div>
        </div>
        <div className="max-h-[420px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-400 py-8 text-[18px]">
              There are no notifications
            </div>
          ) : (
            notifications.map((noti) => (
              <div
                key={noti.noticeId}
                className="flex items-start gap-3 px-5 py-4 border-b last:border-b-0 hover:bg-red-50 transition"
                onClick={() => handleMarkRead(Number(noti.noticeId))}
              >
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="text-gray-700">{noti.content}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">
                      {noti.createdDate
                        ? new Date(noti.createdDate).toLocaleString()
                        : noti.time}
                    </span>
                    {noti.icon && <span className="text-lg">{noti.icon}</span>}
                  </div>
                </div>
                {!noti.read && (
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
