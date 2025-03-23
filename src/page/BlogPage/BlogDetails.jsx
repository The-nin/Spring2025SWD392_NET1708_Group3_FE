import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogById } from "../../service/blog/index";
import { Spin } from "antd";
import "react-quill-new/dist/quill.snow.css"; // Ensure Quill styles are loaded

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await getBlogById(id);
        if (!response.error) {
          setBlog(response.result);
        } else {
          console.error("Failed to fetch blog:", response.message);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!blog) {
    return <p className="text-center text-gray-600 mt-6">Blog not found.</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-black">{blog.blogName}</h1>
        <p className="text-gray-500 italic mb-3">
          Tác giả: <span className="font-medium">{blog.author}</span>
        </p>
        <p className="  mb-3">
          <p className="text-gray-500 italic mb-3">
            Ngày đăng:{" "}
            <span className="font-medium">
              {new Date(blog.date).toLocaleDateString("vi-VN")}
            </span>
          </p>
        </p>
        {/* ✅ Properly Render Quill HTML */}
        <div
          className="ql-editor mt-4 text-gray-800"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
};

export default BlogDetail;
