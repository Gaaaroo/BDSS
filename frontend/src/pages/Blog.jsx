import React, { useEffect, useState } from 'react';
import {
  getAllBlogs,
  getMyBlogs,
  addBlog,
  updateBlog,
} from '../services/api/blogService';
import BlogDetail from '../components/BlogDetail';
import BlogList from '../components/BlogList';
import BlogForm from '../components/BlogForm';
import Navbar from '../components/Navbar';

export default function Blog() {
  const [view, setView] = useState('all'); // 'all' | 'my' | 'add' | 'update' | 'detail'
  const [blogs, setBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null); // dùng cho detail và update

  const fetchAll = async () => {
    const data = await getAllBlogs();
    setBlogs(data);
  };

  const fetchMy = async () => {
    const data = await getMyBlogs();
    setMyBlogs(data);
  };

  useEffect(() => {
    if (view === 'all') fetchAll();
    if (view === 'my') fetchMy();
  }, [view]);

  const handleAdd = async (data) => {
    await addBlog(data);
    alert('Đã thêm blog!');
    setView('all');
    fetchAll();
  };

  const handleUpdate = async (data) => {
    await updateBlog(selectedBlog.blog_id, data);
    alert('Đã cập nhật blog!');
    setSelectedBlog(null);
    setView('all');
    fetchAll();
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        {/* Menu điều hướng */}
        <div className="flex space-x-6 justify-center mb-10">
          <button
            onClick={() => setView('all')}
            className={`px-6 py-3 rounded-lg shadow transition ${
              view === 'all'
                ? 'bg-red-500 text-white'
                : 'bg-white border border-red-500 text-red-600 hover:bg-red-50'
            }`}
          >
            Tất cả blog
          </button>
          <button
            onClick={() => setView('my')}
            className={`px-6 py-3 rounded-lg shadow transition ${
              view === 'my'
                ? 'bg-red-500 text-white'
                : 'bg-white border border-red-500 text-red-600 hover:bg-red-50'
            }`}
          >
            Blog của tôi
          </button>
          <button
            onClick={() => setView('add')}
            className={`px-6 py-3 rounded-lg shadow transition ${
              view === 'add'
                ? 'bg-red-500 text-white'
                : 'bg-white border border-red-500 text-red-600 hover:bg-red-50'
            }`}
          >
            Thêm blog
          </button>
        </div>

        {/* Hiển thị danh sách tất cả blog */}
        {view === 'all' && (
          <BlogList
            blogs={blogs}
            onSelectBlog={(blog) => {
              setSelectedBlog(blog);
              setView('detail');
            }}
          />
        )}

        {/* Hiển thị danh sách blog cá nhân */}
        {view === 'my' && (
          <BlogList
            blogs={myBlogs}
            onSelectBlog={(blog) => {
              setSelectedBlog(blog);
              setView('detail');
            }}
          />
        )}

        {/* Thêm blog */}
        {view === 'add' && (
          <BlogForm onSubmit={handleAdd} onCancel={() => setView('all')} />
        )}

        {/* Cập nhật blog */}
        {view === 'update' && selectedBlog && (
          <BlogForm
            initialData={selectedBlog}
            onSubmit={handleUpdate}
            onCancel={() => {
              setSelectedBlog(null);
              setView('all');
            }}
          />
        )}

        {/* Xem chi tiết blog */}
        {view === 'detail' && selectedBlog && (
          <BlogDetail
            blog={selectedBlog}
            onBack={() => {
              setSelectedBlog(null);
              setView('all');
            }}
          />
        )}
      </div>
    </>
  );
}
