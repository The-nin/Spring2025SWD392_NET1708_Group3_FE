import React, { useState } from "react";
import { Form, Input, Button, Card, Upload } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { addBrand } from "../../../service/brand/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddNewBrand = () => {
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
          toast.error("Vui lòng chọn một tệp");
          return;
        }

        const requestData = {
          name: values.name,
          description: editorContent,
        };

        formData.append("request", JSON.stringify(requestData));
        formData.append("thumbnail", file);

        const response = await addBrand(formData);
        if (!response.error) {
          navigate("/admin/brand", {
            state: { message: response.message, type: "success" },
          });
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Thêm thương hiệu thất bại");
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
          onClick={() => navigate("/admin/brand")}
          className="mb-4 hover:bg-gray-100"
        >
          Quay lại Thương hiệu
        </Button>

        <Card
          title="Thêm Thương hiệu Mới"
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
              label="Tên Thương hiệu"
              rules={[
                { required: true, message: "Vui lòng nhập tên thương hiệu" },
                { min: 3, message: "Tên phải có ít nhất 3 ký tự" },
              ]}
            >
              <Input
                placeholder="Nhập tên thương hiệu"
                className="h-10 text-base"
              />
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

            <Form.Item
              name="thumbnail"
              label="Hình ảnh"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                { required: true, message: "Vui lòng tải lên một hình ảnh" },
              ]}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                accept="image/*"
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Chọn Hình ảnh</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="h-10 px-8 text-base font-medium"
              >
                Thêm Thương hiệu
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddNewBrand;
