import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Spin, Upload } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCategoryById,
  updateCategory,
  uploadToCloudinary,
} from "../../../service/category/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentThumbnail, setCurrentThumbnail] = useState("");
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

  useEffect(() => {
    fetchCategoryDetails();
  }, [id]);

  const fetchCategoryDetails = async () => {
    try {
      const response = await getCategoryById(id);
      if (!response.error) {
        form.setFieldsValue({
          name: response.result.name,
          description: response.result.description,
        });
        setEditorContent(response.result.description);
        setCurrentThumbnail(response.result.thumbnail);
      } else {
        toast.error(response.message);
        navigate("/admin/category");
      }
    } catch (error) {
      toast.error("Failed to fetch category details");
      navigate("/admin/category");
    } finally {
      setInitialLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      let thumbnailUrl = currentThumbnail;

      if (values.thumbnail?.length > 0) {
        const file = values.thumbnail[0].originFileObj;
        thumbnailUrl = await uploadToCloudinary(file);
      }

      const updateData = {
        name: values.name,
        description: editorContent,
        thumbnail: thumbnailUrl,
      };

      const response = await updateCategory(id, updateData);

      if (!response.error) {
        navigate("/admin/category");
        toast.success("Category updated successfully!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
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
      />
      <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
        <div className="w-full max-w-6xl">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/category")}
            className="mb-4 hover:bg-gray-100"
          >
            Quay lại Danh mục
          </Button>

          <Card
            title="Chỉnh sửa Danh mục"
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
            >
              <Form.Item
                name="name"
                label="Tên Danh mục"
                rules={[
                  { required: true, message: "Vui lòng nhập tên danh mục" },
                  { min: 3, message: "Tên phải có ít nhất 3 ký tự" },
                ]}
              >
                <Input placeholder="Nhập tên danh mục" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Mô tả"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả" },
                  {
                    validator: (_, value) => {
                      if (!editorContent || editorContent.trim().length < 10) {
                        return Promise.reject("Mô tả phải có ít nhất 10 ký tự");
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

              <Form.Item label="Hình ảnh hiện tại">
                {currentThumbnail && (
                  <img
                    src={currentThumbnail}
                    alt="Hình ảnh hiện tại"
                    className="max-w-xs mb-4"
                    style={{ maxHeight: "200px" }}
                  />
                )}
              </Form.Item>

              <Form.Item
                name="thumbnail"
                label="Hình ảnh mới"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  accept="image/*"
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>
                    Tải lên hình ảnh mới
                  </Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Cập nhật Danh mục
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EditCategory;
