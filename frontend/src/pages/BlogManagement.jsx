import React, { useEffect, useState } from 'react';
import logo from '../assets/images/logo2.png';
import {
  getAllBlogs,
  addBlog,
  updateBlog,
  searchBlogByUsername,
  deleteBlog,
} from '../services/api/blogService';
import BlogForm from '../components/BlogForm';
import BlogDetail from '../components/BlogDetail';
import { Pencil, Eye, Trash2 } from 'lucide-react';
import Pagination from '../components/Pagination';
import CustomModal from '../components/CustomModal';
import { blogSchema } from '../Validations/blogValidation';
import { toast } from 'react-toastify';
import MySearch from '../components/MySearch';

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [inputPage, setInputPage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [searchUsername, setSearchUsername] = useState('');
  const [viewBlog, setViewBlog] = useState(null);
  //confirm delete
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ blogId: null });

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      const res = await getAllBlogs(page, 7);
      setBlogs(res.content);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Lỗi khi tải blog:', err);
    }
  };

  const handleGoToPage = () => {
    const pageNum = parseInt(inputPage, 10);
    if (!isNaN(pageNum) && pageNum >= 0 && pageNum < totalPages + 1) {
      setPage(pageNum - 1);
      setInputPage('');
    } else {
      toast.warning(
        `Please enter a valid page number between 1 and ${totalPages}`
      );
    }
  };

  const handleAddClick = () => {
    setEditBlog(null);
    setShowForm(true);
  };

  const handleUpdateClick = (blog) => {
    setEditBlog(blog);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      await blogSchema.validate(formData, { abortEarly: false });
      if (editBlog) {
        await updateBlog(editBlog.blogId, formData);
      } else {
        await addBlog(formData);
      }
      setShowForm(false);
      fetchData();
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.errors.forEach((msg) => {
          toast.error(msg); // mỗi lỗi hiển thị riêng
        });
      } else {
        toast.error('Error saving blog');
      }
    }
  };

  const handleSearch = async () => {
    if (searchUsername.trim() === '') {
      fetchData();
      return;
    }
    try {
      const res = await searchBlogByUsername(searchUsername, page, 7);
      setBlogs(res.content);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error searching blogs:', err);
    }
  };

  const handleViewClick = (blog) => {
    setViewBlog(blog);
  };

  const handleDeleteClick = (blogId) => {
    setDeleteTarget({ blogId: blogId });
    setShowModal(true);
  };

  const handleConfirmDelete = async (blogId) => {
    try {
      await deleteBlog(blogId);

      setShowModal(false);
      setDeleteTarget({ postId: null });
      // Nếu trang hiện tại có 1 blog duy nhất, sau khi xóa thì chuyển về trang trước
      if (blogs.length === 1 && page > 0) {
        setPage((prev) => prev - 1); // sẽ tự trigger useEffect
      } else {
        // GỌI trực tiếp luôn fetchData
        fetchData(); // KHÔNG dùng await ở đây vì không cần đợi
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };
  return (
    <div className="flex">
      {/* Nội dung bên phải */}
      <div className="flex-1 min-h-screen p-4 bg-white">
        {/* Logo ở giữa đầu trang
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-40 w-auto" />
        </div> */}

        {/* Tiêu đề */}
        <div className="flex justify-center items-center mb-4">
          <h1 className="text-4xl font-semibold text-red-600">
            Blog Management
          </h1>
        </div>
        {/* Nút thêm blog */}
        <div className="flex justify-between mb-4">
          <MySearch
            searchTerm={searchUsername}
            setSearchTerm={setSearchUsername}
            placeholder="Search by username"
          />

          <button
            onClick={handleAddClick}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Add Blog
          </button>
        </div>

        {/* Bảng hiển thị blog */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 rounded-lg">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">No.</th>
                <th className="py-2 px-4 text-center">Image</th>
                <th className="py-2 px-4 text-center">Created By</th>
                <th className="py-2 px-4 text-center">Updated By</th>
                <th className="py-2 px-4 text-center">Created At</th>
                <th className="py-2 px-4 text-center">Updated At</th>
                <th className="py-2 px-4 text-center w-[150px]">Title</th>
                <th className="py-2 px-4 text-center">First Content</th>
                <th className="py-2 px-4 text-center w-[100px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-2 text-center text-red-500">
                    No information found.
                  </td>
                </tr>
              ) : (
                blogs.map((blog, index) => (
                  <tr key={blog.blogId} className="even:bg-red-50 odd:bg-white">
                    <td className="py-2 px-4 text-left">
                      {page * 7 + index + 1}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <img
                        src={blog.imageLink}
                        alt="blog"
                        className="w-24 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="py-2 px-4 text-center">{blog.userCreate}</td>
                    <td className="py-2 px-4 text-center">
                      {blog.userUpdate || 'not update'}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {blog.createdDate}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {blog.updateDate || 'not update'}
                    </td>
                    <td className="py-2 px-4 text-center">{blog.title}</td>
                    <td className="py-2 px-4 text-center max-w-[250px]">
                      <div className="line-clamp-2">
                        {blog.sections && blog.sections.length > 0
                          ? blog.sections[0].content
                          : ''}
                      </div>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <div className="flex justify-center items-center space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleUpdateClick(blog)}
                          className="text-red-500 hover:text-red-700"
                          title="Update"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleViewClick(blog)}
                          className="text-green-500 hover:text-green-700"
                          title="View"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(blog.blogId)}
                          className="text-red-700 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          inputPage={inputPage}
          setInputPage={setInputPage}
          onGoToPage={handleGoToPage}
        />

        {/* Hiển thị form thêm/sửa blog nếu showForm là true */}
        {showForm && (
          <div className="fixed inset-0 z-100  flex items-center justify-center bg-black/50 backdrop-blur-xs">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full max-h-[100vh] relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-4 text-gray-600 text-4xl font-bold hover:text-red-600 z-10"
              >
                x
              </button>
              <div className="mt-5 mb-5 overflow-y-auto max-h-[80vh]">
                <BlogForm
                  initialData={editBlog}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        )}

        {viewBlog && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-xs">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full max-h-[100vh] relative overflow-y-auto">
              <button
                onClick={() => setViewBlog(null)}
                className="absolute top-2 right-4 text-gray-600 text-4xl font-bold hover:text-red-600 z-10"
              >
                x
              </button>
              <div className="mt-5 mb-5 overflow-y-auto max-h-[80vh]">
                <BlogDetail blog={viewBlog} onBack={() => setViewBlog(null)} />
              </div>
            </div>
          </div>
        )}
      </div>
      {showModal && (
        <CustomModal
          title="Confirm deletion"
          onCancel={() => {
            setShowModal(false);
            setDeleteTarget({ postId: null, commentId: null });
          }}
          onOk={() => handleConfirmDelete(deleteTarget.blogId)}
          okLable="Delete"
        >
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete this blog?
          </p>
        </CustomModal>
      )}
    </div>
  );
}
