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
          status: response.result.status,
          date: dayjs(response.result.date),
        });
        setCurrentThumbnail(response.result.image);
        setContent(response.result.content); // ✅ Set ReactQuill content
      } else {
        toast.error(response.message);
        navigate("/admin/blog");
      }
    } catch (error) {
      toast.error("Failed to fetch blog details");
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
        toast.success("Blog updated successfully!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update blog");
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
          Back to Blog
        </Button>

        <Card title="Edit Blog" className="max-w-3xl">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="blogName"
              label="Blog Name"
              rules={[{ required: true, message: "Please enter blog name" }]}
            >
              <Input placeholder="Enter blog name" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <Input.TextArea rows={4} placeholder="Enter blog description" />
            </Form.Item>

            {/* ✅ ReactQuill for Blog Content */}
            <Form.Item
              label="Content"
              rules={[{ required: true, message: "Please enter content" }]}
            >
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
              />
            </Form.Item>

            <Form.Item
              name="createdBy"
              label="Author"
              rules={[{ required: true, message: "Please enter author name" }]}
            >
              <Input placeholder="Enter author name" />
            </Form.Item>

            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select date" }]}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" />
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
              label="New Thumbnail"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Upload New Image</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select>
                <Select.Option value="ACTIVE">Active</Select.Option>
                <Select.Option value="INACTIVE">Inactive</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Blog
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default EditBlog;
