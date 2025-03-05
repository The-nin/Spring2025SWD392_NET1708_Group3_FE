import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { getAllBlogs } from "../../service/blog/index"; // Import API call
import { Spin } from "antd";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlogs();
        if (!response.error && Array.isArray(response.result)) {
          // ✅ Filter only blogs with "ACTIVE" status
          const activeBlogs = response.result.filter(
            (blog) => blog.status === "ACTIVE"
          );
          setBlogs(activeBlogs);
        } else {
          console.error("Failed to fetch blogs:", response.message);
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen">
      {/* Header */}
      <motion.header
        className="bg-black text-white py-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl font-bold">Skincare Blog</h1>
        <p className="text-lg mt-2">
          Stay updated with the latest skincare tips
        </p>
      </motion.header>

      {/* Blog Sections */}
      {blogs.length === 0 ? (
        <p className="text-center text-gray-600 mt-6">
          No active blogs available yet.
        </p>
      ) : (
        blogs.map(({ id, blogName, description, image }, index) => (
          <motion.section
            key={id}
            className="container mx-auto my-12 px-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col md:flex-row items-center">
              {/* Text Section */}
              <div className="md:w-1/2 text-center md:text-left">
                <h2 className="text-3xl font-bold text-black mb-4 text-left">
                  {blogName}
                </h2>
                <p className="text-gray-700 text-justify">{description}</p>
                <Link
                  to={`/blog/${id}`} // ✅ Navigate to blog details page
                  className="inline-flex items-center text-black hover:opacity-75 transition-opacity"
                >
                  <motion.div
                    className="border border-black px-8 py-4 flex items-center justify-between min-w-[180px] mt-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-gray-700">Read more</span>
                    <FaArrowRight className="ml-4" />
                  </motion.div>
                </Link>
              </div>

              {/* Image Section */}
              <motion.div
                className="md:w-1/2 mt-6 md:mt-0 flex justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <img
                  src={image}
                  alt={blogName}
                  className="rounded-lg shadow-lg w-full max-w-xl transition-transform duration-500 ease-in-out transform hover:scale-105"
                />
              </motion.div>
            </div>
          </motion.section>
        ))
      )}
    </div>
  );
};

export default BlogPage;
