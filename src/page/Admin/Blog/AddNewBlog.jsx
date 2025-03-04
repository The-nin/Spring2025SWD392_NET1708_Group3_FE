import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, DatePicker } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { addBlog } from "../../../service/blog/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import dayjs from "dayjs";

// Quill Editor Config
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "align",
  "list",
  "indent",
  "link",
  "image",
];

// Disable past dates
const disabledDate = (current) =>
  current && current.isBefore(dayjs().startOf("day"));

const AddNewBlog = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  // Ensure form content is updated with Quill value
  useEffect(() => {
    form.setFieldsValue({ content });
  }, [content, form]);

  // Handle Form Submission
  const onFinish = async (values) => {
    if (
      !values.blogTitle ||
      !values.blogIntroduction ||
      !values.imageUrl?.trim() ||
      !content.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const blogData = {
        blogName: values.blogTitle,
        image: values.imageUrl,
        description: values.blogIntroduction,
        status: "INACTIVE",
        date: values.publishDate.toISOString(), // ✅ ISO Format Fix
        content: content,
      };

      console.log("📤 Sending Blog Data:", blogData);
      const response = await addBlog(blogData);

      if (response && response.result) {
        toast.success("Blog added successfully!");
        setTimeout(() => navigate("/admin/blog"), 2000); // ✅ Delayed navigation for better UX
      } else {
        toast.error(response?.message || "Error adding blog");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <div className="p-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/blog")}
          className="mb-4 hover:bg-gray-100"
        >
          Back to Blogs
        </Button>

        <Card title="Add New Blog" className="max-w-6xl mx-auto shadow-md">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* Blog Title */}
            <Form.Item
              name="blogTitle"
              label="Blog Title"
              rules={[
                { required: true, message: "Please enter blog title" },
                { min: 3, message: "Title must be at least 3 characters" },
              ]}
            >
              <Input placeholder="Enter blog title" />
            </Form.Item>

            {/* Blog Introduction */}
            <Form.Item
              name="blogIntroduction"
              label="Blog Introduction"
              rules={[
                { required: true, message: "Please enter blog introduction" },
                {
                  min: 50,
                  message: "Introduction must be at least 50 characters",
                },
              ]}
            >
              <Input.TextArea rows={3} placeholder="Enter blog introduction" />
            </Form.Item>

            {/* Image URL */}
            <Form.Item
              name="imageUrl"
              label="Thumbnail Image URL"
              rules={[
                { required: true, message: "Please enter an image URL" },
                { type: "url", message: "Please enter a valid URL" },
              ]}
            >
              <Input placeholder="Enter image URL (e.g., https://example.com/image.jpg)" />
            </Form.Item>

            {/* Blog Content */}
            <Form.Item label="Blog Content" name="content">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
              />
            </Form.Item>

            {/* Publish Date */}
            <Form.Item
              name="publishDate"
              label="Publish Date"
              rules={[
                { required: true, message: "Please select a publish date" },
              ]}
            >
              <DatePicker
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
                className="w-full"
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Add Blog
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddNewBlog;
