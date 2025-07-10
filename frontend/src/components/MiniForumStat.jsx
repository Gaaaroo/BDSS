import React, { useEffect, useState } from 'react';
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  DocumentTextIcon,
  HeartIcon,
} from '@heroicons/react/24/solid';
import {
  countAllUsers,
  countAllComments,
  countAllPosts,
} from '../services/api/forumService';

export default function MiniForumStatProps({reload}) {
  const [postCount, setPostCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [posts, comments, users] = await Promise.all([
          countAllPosts(),
          countAllComments(),
          countAllUsers(),
        ]);
        setPostCount(posts);
        setCommentCount(comments);
        setMemberCount(users);
        console.log('Forum stats fetched successfully:', {
          posts: posts.data,
          comments: comments.data,
          users: users.data,
        });
      } catch (err) {
        console.error('Error fetching forum stats:', err);
      }
    };
    fetchStats();
  }, [reload]);

  return (
    <>
      <div className="text-center py-4 bg-white text-[#F76C6C] font-semibold tracking-wide shadow flex justify-center gap-8">
        <span className="flex items-center gap-1">
          <DocumentTextIcon className="w-5 h-5 text-[#F76C6C]" />
          {postCount} Posts
        </span>
        <span className="flex items-center gap-1">
          <ChatBubbleLeftRightIcon className="w-5 h-5 text-[#F76C6C]" />
          {commentCount} Comments
        </span>
        <span className="flex items-center gap-1">
          <UserGroupIcon className="w-5 h-5 text-[#F76C6C]" />
          {memberCount} Members
        </span>
      </div>
    </>
  );
}
