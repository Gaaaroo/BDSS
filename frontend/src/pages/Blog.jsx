import React, { useEffect, useState } from 'react';
import { getAllBlogs } from '../services/api/blogService';
import BlogDetail from '../components/BlogDetail';
import BlogList from '../components/BlogList';
import BlogForm from '../components/BlogForm';
import Navbar from '../components/Navbar';
import WidgetChat from '../components/WidgetChat';
import MapPin from '../components/MapPin';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchAll = async () => {
    const data = await getAllBlogs(page);
    setBlogs(data.content);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchAll();
  }, [page]);

  // const handleUpdate = async (data) => {
  //   await updateBlog(selectedBlog.blogId, data);
  //   alert('Đã cập nhật blog!');
  //   setSelectedBlog(null);
  //   setView('all');
  //   fetchAll();
  // };

  return (
    <>
      <Navbar />
      <div className="p-6">
        {/* Hiển thị danh sách blog hoặc chi tiết */}
        {!selectedBlog ? (
          <>
            <BlogList
              blogs={blogs}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
              onSelectBlog={(blog) => setSelectedBlog(blog)}
            />
            <WidgetChat />
            <MapPin />
          </>
        ) : (
          <>
            <BlogDetail
              blog={selectedBlog}
              onBack={() => setSelectedBlog(null)}
            />
            <WidgetChat />
            <MapPin />
          </>
        )}
      </div>
    </>
  );
}
