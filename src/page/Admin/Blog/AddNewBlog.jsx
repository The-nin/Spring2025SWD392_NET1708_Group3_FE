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
      toast.error("Hãy nhập toàn bộ ô trống");
      return;
    }

    // Extract file from the Ant Design Upload component
    const file = values.imageUrl?.[0]?.originFileObj;
    if (!file) {
      toast.error("Hãy thêm hình ảnh");
      return;
    }

    try {
      setLoading(true);

      // ✅ Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(file);
      if (!imageUrl) {
        toast.error("Thêm hình ảnh thất bại");
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
          Quay lại quản lý Blog
        </Button>

        <Card title="Thêm Blog mới" className="max-w-6xl mx-auto shadow-md">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* Blog Title */}
            <Form.Item
              name="blogTitle"
              label="Tiêu đề"
              rules={[
                { required: true, message: "Nhập tiêu đề " },
                { min: 3, message: "Tiêu đề có ít nhất 3 chữ cái" },
              ]}
            >
              <Input placeholder="Nhập tiêu đề" />
            </Form.Item>

            {/* Blog Introduction */}
            <Form.Item
              name="blogIntroduction"
              label="Giới thiệu Blog"
              rules={[
                { required: true, message: "Nhập đoạn giới thiệu Blog" },
                {
                  min: 50,
                  message: "Giới thiệu có ít nhất 50 chữ cái",
                },
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Nhập đoạn giới thiệu Blog"
              />
            </Form.Item>

            {/* Image URL */}
            <Form.Item
              name="imageUrl"
              label="Ảnh Thumbnail"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: "Thêm ảnh" }]}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                accept="image/*"
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
              </Upload>
            </Form.Item>

            {/* Blog Content */}
            <Form.Item label="Content Blog">
              <Form.Item
                name="content"
                noStyle
                rules={[{ required: true, message: "Hãy nhập blog content" }]}
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
              label="Ngày sản xuất"
              rules={[{ required: true, message: "Hãy nhập ngày tạo" }]}
            >
              <DatePicker
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
                className="w-full"
              />
            </Form.Item>
            <Form.Item
              name="author"
              label="Tác giả"
              rules={[
                { required: true, message: "Hãy nhập tác giả" },
                { min: 3, message: "Tác giả có ít nhất 3 chữ cái" },
              ]}
            >
              <Input placeholder="Hãy nhập tác giả" />
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
