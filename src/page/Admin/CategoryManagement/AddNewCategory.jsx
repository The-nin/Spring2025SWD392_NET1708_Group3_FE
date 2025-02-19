import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { addCategory } from "../../../service/category/index";

const AddNewCategory = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await addCategory(values);

      if (!response.error) {
        message.success(response.message);
        navigate("/admin/category");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50">
      <div className="p-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/category")}
          className="mb-4 hover:bg-gray-100"
        >
          Back to Categories
        </Button>

        <Card
          title="Add New Category"
          className="max-w-6xl mx-auto shadow-md"
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
              label="Category Name"
              rules={[
                { required: true, message: "Please enter category name" },
                { min: 3, message: "Name must be at least 3 characters" },
              ]}
            >
              <Input
                placeholder="Enter category name"
                className="h-10 text-base"
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
                rows={6}
                placeholder="Enter category description"
                maxLength={500}
                showCount
                className="text-base"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="h-10 px-8 text-base font-medium"
              >
                Add Category
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddNewCategory;
