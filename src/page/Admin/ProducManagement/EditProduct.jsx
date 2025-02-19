import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Button, Card, message, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  updateProduct,
} from "../../../service/productManagement";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await getProductById(id);
      if (!response.error) {
        form.setFieldsValue(response.result);
      } else {
        message.error(response.message);
        navigate("/admin/product");
      }
    } catch (error) {
      message.error("Failed to fetch product details");
      navigate("/admin/product");
    } finally {
      setInitialLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await updateProduct(id, values);

      if (!response.error) {
        message.success(response.message);
        navigate("/admin/product");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Failed to update product");
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
    <div className="p-6">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/admin/product")}
        className="mb-4"
      >
        Back to Products
      </Button>

      <Card title="Edit Product" className="max-w-3xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[
              { required: true, message: "Please enter product name" },
              { min: 3, message: "Name must be at least 3 characters" },
            ]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: "Please enter price" },
              {
                type: "number",
                min: 0.01,
                message: "Price must be greater than 0",
              },
            ]}
          >
            <InputNumber
              className="w-full"
              min={0.01}
              step={0.01}
              placeholder="Enter price"
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
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
              placeholder="Enter product description"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Product
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditProduct;
