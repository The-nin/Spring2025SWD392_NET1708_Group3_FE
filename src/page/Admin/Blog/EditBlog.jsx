import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, DatePicker } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { getBlogById, updateBlog } from "../../../service/blog/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import dayjs from "dayjs";

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

const disabledDate = (current) =>
  current && current.isBefore(dayjs().startOf("day"));

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(""); // ✅ State for ReactQuill

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await getBlogById(id);

        if (response && response.result) {
          const blog = response.result;

          // ✅ Set form fields
          form.setFieldsValue({
            blogTitle: blog.blogName || "",
            blogIntroduction: blog.description || "",
            imageUrl: blog.image || "",
            publishDate: blog.date ? dayjs(blog.date) : null,
          });

          // ✅ Set Quill content correctly
          setContent(blog.content || "");
        } else {
          toast.error("Failed to fetch blog details");
        }
      } catch (error) {
        toast.error("Error loading blog details");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]); // ✅ No need to include `form`, it will update automatically

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
        date: values.publishDate.toISOString(),
        content: content, // ✅ Ensure content is included
      };

      const response = await updateBlog(id, blogData);
      if (response && response.result) {
        toast.success("Blog updated successfully!");
        setTimeout(() => navigate("/admin/blog"), 2000);
      } else {
        toast.error(response?.message || "Error updating blog");
      }
    } catch (error) {
      toast.error("Failed to update blog");
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

        <Card title="Edit Blog" className="max-w-6xl mx-auto shadow-md">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
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

            {/* ✅ ReactQuill - Fixed */}
            <Form.Item label="Blog Content">
              <ReactQuill
                theme="snow"
                value={content} // ✅ Controlled component
                onChange={(value) => setContent(value)} // ✅ Update state on change
                modules={modules}
                formats={formats}
              />
            </Form.Item>

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

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Blog
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default EditBlog;
