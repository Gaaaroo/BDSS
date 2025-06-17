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

// const blogs = [
//   {
//     picture:
//       "https://i.pinimg.com/736x/5a/16/9f/5a169fb00d7b5bab7422c71fbd015066.jpg",
//     title: "Blog số 1",
//     description: "Đây là nội dung blog số 1. Nội dung ngắn gọn và súc tích.",
//   },
//   {
//     picture:
//       "https://i.pinimg.com/736x/9c/b0/c7/9cb0c71c7bdfd77701708d2b07d6af23.jpg",
//     title: "Blog số 2",
//     description: "Đây là nội dung blog số 2. Thông tin hữu ích và hấp dẫn.",
//   },
//   {
//     picture:
//       "https://i.pinimg.com/736x/c5/20/c9/c520c9be966688e55138af0b56885165.jpg",
//     title: "Blog số 3",
//     description: "Đây là nội dung blog số 3. Chia sẻ kiến thức và kinh nghiệm.",
//   },
// ];

// const BlogSection = () => (
//   <>
//     <h2 className="text-5xl font-bold text-red-700 mx-60 pt-15 ">Blogs</h2>
//     <div className="flex justify-center gap-30 py-15 ">
//       {blogs.map((blog, idx) => (
//         <div
//           key={idx}
//           className="border border-gray-200 rounded-lg p-4 w-100 h-120 bg-gray-50 shadow-md flex flex-col items-center"
//         >
//           <img
//             src={blog.picture}
//             alt={blog.title}
//             className="mb-4 w-full h-85 object-cover rounded-md"
//           />
//           <h3 className="text-lg font-semibold mb-2 text-center">
//             {blog.title}
//           </h3>
//           <p className="text-gray-700 text-center">{blog.description}</p>
//         </div>
//       ))}
//     </div>
//   </>
// );

// export default BlogSection;
