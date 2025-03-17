import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Card, Spin, Upload } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { getBrandById, updateBrand } from "../../../service/brand/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditBrand = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentThumbnail, setCurrentThumbnail] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const editorRef = useRef(null); // Thêm ref để lưu trữ instance của editor

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
    fetchBrandDetails();
  }, [id]);

  const fetchBrandDetails = async () => {
    try {
      const response = await getBrandById(id);
      if (!response.error) {
        form.setFieldsValue({
          name: response.result.name,
          description: response.result.description,
        });
        setEditorContent(response.result.description);
        setCurrentThumbnail(response.result.thumbnail);
      } else {
        toast.error(response.message);
        navigate("/admin/brand");
      }
    } catch (error) {
      toast.error("Failed to fetch brand details");
      navigate("/admin/brand");
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
      const formData = new FormData();

      let thumbnailUrl = currentThumbnail;
      if (values.thumbnail?.length > 0) {
        const file = values.thumbnail[0].originFileObj;
        formData.append("thumbnail", file);
      }

      const updateData = {
        name: values.name,
        description: editorContent,
        thumbnail: thumbnailUrl,
      };

      const response = await updateBrand(id, updateData);

      if (!response.error) {
        navigate("/admin/brand");
        toast.success("Brand updated successfully!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update brand");
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
            onClick={() => navigate("/admin/brand")}
            className="mb-4 hover:bg-gray-100"
          >
            Quay lại Thương hiệu
          </Button>

          <Card title="Chỉnh sửa Thương hiệu" className="w-full">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                name="name"
                label="Tên Thương hiệu"
                rules={[
                  { required: true, message: "Vui lòng nhập tên thương hiệu" },
                  { min: 3, message: "Tên phải có ít nhất 3 ký tự" },
                ]}
              >
                <Input placeholder="Nhập tên thương hiệu" />
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
                  Cập nhật Thương hiệu
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EditBrand;
