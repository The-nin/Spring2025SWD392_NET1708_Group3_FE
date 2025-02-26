import React, { useState } from "react";
import { Form, Input, Button, Card, message, Upload } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { addBlog } from "../../../service/blog/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddNewBlog = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    if (values.name && values.description && values.thumbnail?.length > 0) {
      try {
        setLoading(true);
        const formData = new FormData();

        const file = values.thumbnail[0].originFileObj;

        if (!file) {
          toast.error("Please select a file");
          return;
        }

        formData.append(
          "request",
          JSON.stringify({ name: values.name, description: values.description })
        );
        formData.append("thumbnail", file);

        const response = await addBlog(formData);
        if (!response.error) {
          navigate("/admin/blog", {
            state: { message: response.message, type: "success" },
          });
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to add blog");
      } finally {
        setLoading(false);
      }
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
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="p-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/blog")}
          className="mb-4 hover:bg-gray-100"
        >
          Back to Blogs
        </Button>

        <Card
          title="Add New Blog"
          className="max-w-6xl mx-auto shadow-md"
          headStyle={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            borderBottom: "2px solid #f0f0f0",
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            className="space-y-4"
          >
            <Form.Item
              name="name"
              label="Blog Name"
              rules={[
                { required: true, message: "Please enter blog name" },
                { min: 3, message: "Name must be at least 3 characters" },
              ]}
            >
              <Input placeholder="Enter blog name" className="h-10 text-base" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please enter description" },
                {
                  min: 10,
                  message: "Description must be at least 10 characters",
                },
              ]}
            >
              <Input.TextArea
                rows={6}
                placeholder="Enter blog description"
                maxLength={500}
                showCount
                className="text-base"
              />
            </Form.Item>

            <Form.Item
              name="thumbnail"
              label="Thumbnail"
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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="h-10 px-8 text-base font-medium"
              >
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
