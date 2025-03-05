import { Button, Card, Col, Form, Input, InputNumber, Row } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { createNewService } from "../../service/serviceManagement";

function AddNewService() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    console.log("Received values of form: ", values)

    const { serviceName, price, description } = values;

    const formattedPrice = parseFloat(price);
    
    try {
      const data = await createNewService({
        serviceName,
        price: formattedPrice,
        description,
      });
      if (data) {
        toast.success("Service created successfully");
        navigate("/admin/service");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-[calc(100vh-64px)] bg-gray-50 p-6 overflow-y-auto"'>
      <ToastContainer />

      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/admin/service")}
        className="mb-4 hover:bg-gray-100"
      >
        Back to Service
      </Button>

      <Card
        title={
          <h2 className="text-3xl font-semibold text-gray-800">
            Add New Service
          </h2>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="space-y-6"
        >
          <Row>
            <Col span={12}>
              <Form.Item
                name="serviceName"
                label="Service Name"
                rules={[
                  { required: true, message: "Please enter service name" },
                  {
                    min: 5,
                    message: "Service name must be at least 5 characters",
                  },
                ]}
                className="mr-10"
              >
                <Input
                  placeholder="Enter service name"
                  className="rounded-md h-12"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
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
            </Col>
          </Row>

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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full md:w-auto px-8 h-12 rounded-md bg-blue-600 hover:bg-blue-700"
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default AddNewService;
