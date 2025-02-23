import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Select, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { getBrandById, updateBrand } from "../../../service/brand/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditBrand = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

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
          status: response.result.status,
          thumbnail: response.result.thumbnail,
        });
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/admin/brand");
      }
    } catch (error) {
      toast.error("Failed to fetch brand details", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/admin/brand");
    } finally {
      setInitialLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await updateBrand(id, values);

      if (!response.error) {
        navigate("/admin/brand");
        toast.success("Brand updated successfully!", {
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
      toast.error("Failed to update brand", {
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
          onClick={() => navigate("/admin/brand")}
          className="mb-4"
        >
          Back to Brands
        </Button>

        <Card title="Edit Brand" className="max-w-3xl">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="name"
              label="Brand Name"
              rules={[
                { required: true, message: "Please enter brand name" },
                { min: 3, message: "Name must be at least 3 characters" },
              ]}
            >
              <Input placeholder="Enter brand name" />
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
                placeholder="Enter brand description"
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="thumbnail"
              label="Thumbnail URL"
              rules={[
                { required: true, message: "Please enter thumbnail URL" },
                { type: "url", message: "Please enter a valid URL" },
              ]}
            >
              <Input placeholder="Enter thumbnail URL" />
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
                Update Brand
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default EditBrand;
