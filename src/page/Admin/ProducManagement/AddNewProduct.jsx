import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  message,
  Upload,
  Select,
} from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../../service/productManagement";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllCategories } from "../../../service/category";

const AddNewProduct = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getAllCategories();
      if (!response.error) {
        const activeCategories =
          response.result?.categoryResponses.filter(
            (category) => category.status === "ACTIVE"
          ) || [];
        setCategories(activeCategories);
      } else {
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = async (values) => {
    if (
      values.name &&
      values.price &&
      values.description &&
      values.thumbnail?.length > 0 &&
      values.categoryId
    ) {
      try {
        setLoading(true);
        const formData = new FormData();

        // Get file from upload component
        const file = values.thumbnail[0].originFileObj;

        if (!file) {
          message.error("Please select a file");
          return;
        }

        formData.append(
          "request",
          JSON.stringify({
            name: values.name,
            price: values.price,
            description: values.description,
            categoryId: values.categoryId,
          })
        );
        formData.append("thumbnail", file);

        const response = await addProduct(formData);
        if (!response.error) {
          navigate("/admin/product", {
            state: { message: response.message, type: "success" },
          });
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Failed to add product");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50 p-6 overflow-y-auto">
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

      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/admin/product")}
        className="mb-4 hover:bg-gray-100"
      >
        Back to Products
      </Button>

      <Card
        title={
          <h2 className="text-2xl font-semibold text-gray-800">
            Add New Product
          </h2>
        }
        className="max-w-5xl mx-auto shadow-md rounded-lg"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="space-y-6"
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[
              { required: true, message: "Please enter product name" },
              { min: 3, message: "Name must be at least 3 characters" },
            ]}
          >
            <Input
              placeholder="Enter product name"
              className="rounded-md h-12"
            />
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
              className="w-full rounded-md h-12"
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
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              placeholder="Select a category"
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              className="w-full rounded-md h-12"
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
              className="upload-list-inline"
            >
              <Button icon={<UploadOutlined />} className="rounded-md h-12">
                Select Image
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full md:w-auto px-8 h-12 rounded-md bg-blue-600 hover:bg-blue-700"
            >
              Add Product
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddNewProduct;
