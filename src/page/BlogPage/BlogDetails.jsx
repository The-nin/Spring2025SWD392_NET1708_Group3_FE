import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogById } from "../../service/blog/index"; // Import API call
import { Spin } from "antd";

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
        <img
          src={blog.image}
          alt={blog.blogName}
          className="w-full rounded-lg mt-4"
        />
        <p className="text-gray-700 mt-4">{blog.description}</p>
      </div>
    </div>
  );
};

export default BlogDetail;
