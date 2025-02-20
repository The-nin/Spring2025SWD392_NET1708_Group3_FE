import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Card, message, Upload } from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../../service/productManagement";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddNewProduct = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

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
      values.thumbnail?.length > 0
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
    <div className="p-6">
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
        className="mb-4"
      >
        Back to Products
      </Button>

      <Card title="Add New Product" className="max-w-3xl">
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
            <Button type="primary" htmlType="submit" loading={loading}>
              Add Product
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddNewProduct;
