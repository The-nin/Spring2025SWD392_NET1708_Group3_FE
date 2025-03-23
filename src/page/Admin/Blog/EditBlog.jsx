import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  Spin,
  Upload,
  DatePicker,
} from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  getBlogById,
  updateBlog,
  uploadToCloudinary,
} from "../../../service/blog/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

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

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentThumbnail, setCurrentThumbnail] = useState("");
  const [content, setContent] = useState(""); // ✅ Content state for ReactQuill

  useEffect(() => {
    fetchBlogDetails();
  }, [id]);

  const fetchBlogDetails = async () => {
    try {
      const response = await getBlogById(id);
      if (!response.error) {
        form.setFieldsValue({
          blogName: response.result.blogName,
          description: response.result.description,
          createdBy: response.result.createdBy,
          date: dayjs(response.result.date),
        });
        setCurrentThumbnail(response.result.image);
        setContent(response.result.content); // ✅ Set ReactQuill content
      } else {
        toast.error(response.message);
        navigate("/admin/blog");
      }
    } catch (error) {
      toast.error("Không thể lấy thông tin chi tiết về bài viết");
      navigate("/admin/blog");
    } finally {
      setInitialLoading(false);
    }
  };

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      let imageUrl = currentThumbnail;

      if (values.image?.length > 0) {
        const file = values.image[0].originFileObj;
        imageUrl = await uploadToCloudinary(file);
      }

      const updateData = {
        ...values,
        image: imageUrl,
        date: values.date.format("YYYY-MM-DD"),
        content: content, // ✅ Ensure content is included
      };

      console.log("Sending update data:", updateData, updateData.image); // Debugging

      const response = await updateBlog(id, updateData, updateData.image);

      if (!response.error) {
        navigate("/admin/blog");
        toast.success("Bài viết được cập nhật thành công!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Không cập nhật được bài viết");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="p-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/blog")}
          className="mb-4"
        >
          Quay lại quản lý bài viết
        </Button>

        <Card title="Điều chỉnh Blog" className="max-w-3xl">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="blogName"
              label="Tên bài viết"
              rules={[{ required: true, message: "Nhập tên bài viết" }]}
            >
              <Input placeholder="Nhập tên bài viết" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Miêu tả"
              rules={[{ required: true, message: "Nhập miêu tả" }]}
            >
              <Input.TextArea rows={4} placeholder="Nhập miêu tả" />
            </Form.Item>

            {/* ✅ ReactQuill for Blog Content */}
            <Form.Item
              label="Content"
              rules={[{ required: true, message: "Nhập content" }]}
            >
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
              />
            </Form.Item>

            <Form.Item label="Current Thumbnail">
              {currentThumbnail && (
                <img
                  src={currentThumbnail}
                  alt="Current thumbnail"
                  className="max-w-xs mb-4"
                  style={{ maxHeight: "200px" }}
                />
              )}
            </Form.Item>

            <Form.Item
              name="image"
              label="Nhập Thumbnail"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Thêm ảnh mới</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update bài viết
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default EditBlog;
