import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, DatePicker, Upload } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { addBlog } from "../../../service/blog/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import dayjs from "dayjs";
import { uploadToCloudinary } from "../../../service/blog/index";

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
      !values.author ||
      !values.imageUrl ||
      !content.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // Extract file from the Ant Design Upload component
    const file = values.imageUrl?.[0]?.originFileObj;
    if (!file) {
      toast.error("Please upload a valid image");
      return;
    }

    try {
      setLoading(true);

      // ✅ Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(file);
      if (!imageUrl) {
        toast.error("Image upload failed");
        return;
      }

      const blogData = {
        blogName: values.blogTitle,
        image: imageUrl, // ✅ Store URL instead of Base64
        description: values.blogIntroduction,
        status: "INACTIVE",
        date: values.publishDate.toISOString(),
        createdBy: values.author,
        content: content,
      };

      console.log("📤 Sending Blog Data:", blogData);
      const response = await addBlog(blogData);

      if (response && response.result) {
        toast.success("Blog added successfully!");
        setTimeout(() => navigate("/admin/blog"), 2000);
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

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
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
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: "Please upload an image" }]}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                accept="image/*"
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Select Image</Button>
              </Upload>
            </Form.Item>

            {/* Blog Content */}
            <Form.Item label="Blog Content">
              <Form.Item
                name="content"
                noStyle
                rules={[
                  { required: true, message: "Please enter blog content" },
                ]}
              >
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                />
              </Form.Item>
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
            <Form.Item
              name="author"
              label="Create By"
              rules={[
                { required: true, message: "Please enter athor" },
                { min: 3, message: "Title must be at least 3 characters" },
              ]}
            >
              <Input placeholder="Enter blog title" />
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
