import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Select, Spin, Upload } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCategoryById,
  updateCategory,
  uploadToCloudinary,
} from "../../../service/category/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentThumbnail, setCurrentThumbnail] = useState('');

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
          status: response.result.status,
        });
        setCurrentThumbnail(response.result.thumbnail);
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/admin/category");
      }
    } catch (error) {
      toast.error("Failed to fetch category details", {
        position: "top-right",
        autoClose: 3000,
      });
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

      // Nếu có file ảnh mới được upload
      if (values.thumbnail?.length > 0) {
        const file = values.thumbnail[0].originFileObj;
        const formData = new FormData();
        formData.append("file", file);
        thumbnailUrl = await uploadToCloudinary(file);
      }

      const updateData = {
        ...values,
        thumbnail: thumbnailUrl,
      };

      const response = await updateCategory(id, updateData);

      if (!response.error) {
        navigate("/admin/category");
        toast.success("Category updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Failed to update category", {
        position: "top-right",
        autoClose: 3000,
      });
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
      <div className="p-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/category")}
          className="mb-4"
        >
          Back to Categories
        </Button>

        <Card title="Edit Category" className="max-w-3xl">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="name"
              label="Category Name"
              rules={[
                { required: true, message: "Please enter category name" },
                { min: 3, message: "Name must be at least 3 characters" },
              ]}
            >
              <Input placeholder="Enter category name" />
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
                rows={4}
                placeholder="Enter category description"
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item label="Current Thumbnail">
              {currentThumbnail && (
                <img
                  src={currentThumbnail}
                  alt="Current thumbnail"
                  className="max-w-xs mb-4"
                  style={{ maxHeight: '200px' }}
                />
              )}
            </Form.Item>

            <Form.Item
              name="thumbnail"
              label="New Thumbnail"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                accept="image/*"
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
                Update Category
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default EditCategory;
