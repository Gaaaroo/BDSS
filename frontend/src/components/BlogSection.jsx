import React from "react";

const blogs = [
  {
    picture:
      "https://i.pinimg.com/736x/5a/16/9f/5a169fb00d7b5bab7422c71fbd015066.jpg",
    title: "Blog số 1",
    description: "Đây là nội dung blog số 1. Nội dung ngắn gọn và súc tích.",
  },
  {
    picture:
      "https://i.pinimg.com/736x/9c/b0/c7/9cb0c71c7bdfd77701708d2b07d6af23.jpg",
    title: "Blog số 2",
    description: "Đây là nội dung blog số 2. Thông tin hữu ích và hấp dẫn.",
  },
  {
    picture:
      "https://i.pinimg.com/736x/c5/20/c9/c520c9be966688e55138af0b56885165.jpg",
    title: "Blog số 3",
    description: "Đây là nội dung blog số 3. Chia sẻ kiến thức và kinh nghiệm.",
  },
];

const BlogSection = () => (
  <>
    <h2 className="text-5xl font-bold text-red-700 mx-60 pt-15">Blogs</h2>
    <div className="flex justify-center gap-30 py-15">
      {blogs.map((blog, idx) => (
        <div
          key={idx}
          className="border border-gray-200 rounded-lg p-4 w-100 h-120 bg-gray-50 shadow-md flex flex-col items-center"
        >
          <img
            img
            src={blog.picture}
            alt={blog.title}
            className="mb-4 w-full h-85 object-cover rounded-md"
          />
          <h3 className="text-lg font-semibold mb-2 text-center">
            {blog.title}
          </h3>
          <p className="text-gray-700 text-center">{blog.description}</p>
        </div>
      ))}
    </div>
  </>
);

export default BlogSection;
