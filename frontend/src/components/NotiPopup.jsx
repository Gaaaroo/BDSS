import { Bell } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

const notifications = [
  {
    id: 1,
    user: 'Vy Nguyễn',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    content: 'đã bày tỏ cảm xúc về bình luận bằng nhãn dán của bạn.',
    time: '2 giờ',
    icon: '😊',
  },
  {
    id: 2,
    user: 'Tùng Họa Mi',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    content:
      'đã phát trực tiếp: "TAM BIỆT VIỆT NAM - NGÀY MAI LÊN ĐƯỜNG TỚI VÒNG CHUNG..."',
    time: '1 ngày',
    icon: '🎥',
  },
  {
    id: 3,
    user: 'Hao Phan',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    content: 'đã mời bạn thích Stroke Me Stroke - Exhibition.',
    time: '1 ngày',
    icon: '👍',
    actions: ['Chấp nhận', 'Từ chối'],
  },
  {
    id: 4,
    user: 'Bầy gờ',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    content: 'trong BROTHERS & SISTERS 2025: Mấy ní nhận được mail chưa nè?',
    time: '3 ngày',
    icon: '👥',
  },
  {
    id: 5,
    user: 'Museday',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    content: 'đã thêm 2 ảnh mới: /GÓC FEEDBACK/ Khách đi du lịch biển không...',
    time: '3 ngày',
    icon: '🌊',
  },
];

export default function NotiPopup({ setOpen }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-transparent"
        onClick={() => setOpen(false)}
      />
      {/* Popup */}
      <div
        className="relative w-96 bg-white rounded-xl shadow-xl border border-red-200 p-0 overflow-hidden translate-x-[-60px] translate-y-[64px] z-10"
      >
        <div className="px-5 py-4 border-b border-gray-100 bg-red-50">
          <div className="font-bold text-lg text-red-600 flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" /> Thông báo
          </div>
        </div>
        <div className="max-h-[420px] overflow-y-auto">
          {notifications.map((noti) => (
            <div
              key={noti.id}
              className="flex items-start gap-3 px-5 py-4 border-b last:border-b-0 hover:bg-red-50 transition"
            >
              <img
                src={noti.avatar}
                alt={noti.user}
                className="w-11 h-11 rounded-full object-cover border border-gray-200"
              />
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-semibold text-gray-900">{noti.user}</span>{' '}
                  <span className="text-gray-700">{noti.content}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">{noti.time}</span>
                  {noti.icon && <span className="text-lg">{noti.icon}</span>}
                </div>
              </div>
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}