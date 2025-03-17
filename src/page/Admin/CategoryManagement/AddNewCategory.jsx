import React, { useState } from "react";
import { Form, Input, Button, Card, message, Upload } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { addCategory } from "../../../service/category/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddNewCategory = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
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
    "list",
    "bullet",
    "align",
    "link",
    "image",
  ];

  const onFinish = async (values) => {
    if (values.name && editorContent && values.thumbnail?.length > 0) {
      try {
        setLoading(true);
        const formData = new FormData();
        const file = values.thumbnail[0].originFileObj;

        if (!file) {
          toast.error("Please select a file");
          return;
        }

        const cleanDescription = editorContent
          .replace(/<p><br><\/p>/g, "")
          .trim();

        if (cleanDescription.length < 10) {
          toast.error("Description must be at least 10 characters");
          return;
        }

        const requestData = {
          name: values.name.trim(),
          description: cleanDescription,
          status: 1,
        };

        console.log("Sending data:", requestData);

        formData.append("request", JSON.stringify(requestData));
        formData.append("thumbnail", file);

        const response = await addCategory(formData);
        console.log("Server response:", response);

        if (!response.error) {
          navigate("/admin/category", {
            state: { message: response.message, type: "success" },
          });
        } else {
          toast.error(response.message || "Failed to add category");
        }
      } catch (error) {
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        toast.error(error.response?.data?.message || "Failed to add category");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
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
      <div className="w-full max-w-6xl">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/category")}
          className="mb-4 hover:bg-gray-100"
        >
          Back to Categories
        </Button>

        <Card
          title="Add New Category"
          className="w-full shadow-md"
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
              label="Category Name"
              rules={[
                { required: true, message: "Please enter category name" },
                { min: 3, message: "Name must be at least 3 characters" },
                { whitespace: true, message: "Name cannot be empty" },
              ]}
            >
              <Input
                placeholder="Enter category name"
                className="h-10 text-base"
                maxLength={100}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please enter description" },
                {
                  validator: (_, value) => {
                    if (!editorContent || editorContent.trim().length < 10) {
                      return Promise.reject(
                        "Description must be at least 10 characters"
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <ReactQuill
                theme="snow"
                value={editorContent}
                onChange={(content) => {
                  setEditorContent(content);
                  form.setFieldsValue({ description: content });
                }}
                modules={modules}
                formats={formats}
                style={{ height: "300px", marginBottom: "50px" }}
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
                Add Category
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddNewCategory;
