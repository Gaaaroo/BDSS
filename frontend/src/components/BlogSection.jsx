import React, { useEffect, useState } from 'react';
import { getTop3Blogs } from '../services/api/blogService';
import BlogDetail from '../components/BlogDetail';
import BlogList from '../components/BlogList';
import { useNavigate } from 'react-router';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await getTop3Blogs();
      setBlogs(data);
    } catch (error) {
      console.error('Lỗi khi lấy blog:', error);
    }
  };

  return (
    <div className="p-6 relative">
      {/* Blog List */}
      <div>
        <BlogList
          blogs={blogs}
          onSelectBlog={(blog) => setSelectedBlog(blog)}
        />

        {/* Nút chuyển qua trang tất cả blog */}
        <button
          onClick={() => navigate('/blog')}
          className="ml-20 text-red-600 text-2xl hover:underline font-medium"
        >
          View all blog →
        </button>
      </div>

      {/* Popup hiển thị BlogDetail */}
      {selectedBlog && (
        <div className="fixed inset-0 z-100  flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full max-h-[100vh] relative">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-2 right-4 text-gray-600 text-4xl font-bold hover:text-red-600 z-10"
            >
              ×
            </button>
            <div className="mt-5 mb-5 overflow-y-auto max-h-[80vh]">
              <BlogDetail
                blog={selectedBlog}
                onBack={() => setSelectedBlog(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
