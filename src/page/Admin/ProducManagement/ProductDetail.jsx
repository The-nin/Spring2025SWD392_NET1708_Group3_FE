import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Spin,
  Descriptions,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Table,
  Space,
} from "antd";
import {
  ArrowLeftOutlined,
  InboxOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { getProductById } from "../../../service/productManagement";
import {
  addNewBatch,
  getBatches,
} from "../../../service/productManagement/index";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addBatchModalVisible, setAddBatchModalVisible] = useState(false);
  const [viewBatchesModalVisible, setViewBatchesModalVisible] = useState(false);
  const [batches, setBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        if (!response.error) {
          setProduct(response.result);
        } else {
          toast.error(response.message);
          navigate("/admin/product");
        }
      } catch (error) {
        toast.error("Failed to fetch product details");
        navigate("/admin/product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const fetchBatches = async () => {
    setBatchesLoading(true);
    try {
      const response = await getBatches(id);
      if (!response.error) {
        const batchData = response.result?.content || [];
        setBatches(batchData);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch batches");
    } finally {
      setBatchesLoading(false);
    }
  };

  const handleAddBatch = async (values) => {
    try {
      const batchData = {
        quantity: values.quantity,
        manufactureDate: values.manufactureDate.format("YYYY-MM-DD"),
        expirationDate: values.expirationDate.format("YYYY-MM-DD"),
      };

      const response = await addNewBatch(id, batchData);
      if (!response.error) {
        toast.success("Batch added successfully");
        setAddBatchModalVisible(false);
        form.resetFields();
        // Refresh batches list if viewing
        if (viewBatchesModalVisible) {
          fetchBatches();
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to add batch");
    }
  };

  const handleViewBatches = () => {
    setViewBatchesModalVisible(true);
    fetchBatches();
  };

  const batchColumns = [
    {
      title: "Batch Code",
      dataIndex: "batchCode",
      key: "batchCode",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Manufacture Date",
      dataIndex: "manufactureDate",
      key: "manufactureDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Expiration Date",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-6xl">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/product")}
          className="mb-4 hover:bg-gray-100"
        >
          Back to Products
        </Button>

        <div className="flex justify-end mb-4">
          <Space>
            <Button
              type="primary"
              icon={<InboxOutlined />}
              onClick={handleViewBatches}
            >
              View Batches
            </Button>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => setAddBatchModalVisible(true)}
            >
              Add New Batch
            </Button>
          </Space>
        </div>

        <Card title="Product Details" className="w-full shadow-md">
          {product && (
            <div className="space-y-8">
              {/* Product Image */}
              <div className="flex justify-center">
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-64 h-64 object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Basic Information */}
              <div className="border-b pb-4">
                <Descriptions
                  title="Basic Information"
                  column={2}
                  className="bg-white p-4 rounded-lg"
                >
                  <Descriptions.Item label="Product Name" span={2}>
                    {product.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Price">
                    {product.price?.toLocaleString("vi-VN")}đ
                  </Descriptions.Item>
                  <Descriptions.Item label="Stock">
                    {product.stock || 0}
                  </Descriptions.Item>
                  <Descriptions.Item label="Category">
                    {product.category?.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Brand">
                    {product.brand?.name}
                  </Descriptions.Item>
                </Descriptions>
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg mb-4 text-gray-800">
                    Description
                  </h3>
                  <div
                    dangerouslySetInnerHTML={{ __html: product.description }}
                    className="prose prose-sm md:prose-base lg:prose-lg max-w-none [&>*]:text-center [&_p]:text-center [&_div]:text-center [&_h1]:text-center [&_h2]:text-center [&_h3]:text-center"
                  />
                </div>
              )}

              {/* Ingredient */}
              {product.ingredient && (
                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg mb-4 text-gray-800">
                    Ingredient
                  </h3>
                  <div
                    dangerouslySetInnerHTML={{ __html: product.ingredient }}
                    className="prose prose-sm md:prose-base lg:prose-lg max-w-none [&>*]:text-center [&_p]:text-center [&_div]:text-center [&_h1]:text-center [&_h2]:text-center [&_h3]:text-center"
                  />
                </div>
              )}

              {/* Usage Instruction */}
              {product.usageInstruction && (
                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg mb-4 text-gray-800">
                    Usage Instruction
                  </h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.usageInstruction,
                    }}
                    className="prose prose-sm md:prose-base lg:prose-lg max-w-none [&>*]:text-center [&_p]:text-center [&_div]:text-center [&_h1]:text-center [&_h2]:text-center [&_h3]:text-center"
                  />
                </div>
              )}

              {/* Specification */}
              {product.specification && (
                <div>
                  <h3 className="font-bold text-lg mb-4 text-gray-800">
                    Specification Details
                  </h3>
                  <Descriptions
                    column={2}
                    bordered
                    className="bg-white rounded-lg"
                  >
                    <Descriptions.Item label="Origin">
                      {product.specification.origin}
                    </Descriptions.Item>
                    <Descriptions.Item label="Brand Origin">
                      {product.specification.brandOrigin}
                    </Descriptions.Item>
                    <Descriptions.Item label="Manufacturing Location">
                      {product.specification.manufacturingLocation}
                    </Descriptions.Item>
                    <Descriptions.Item label="Skin Type">
                      {product.specification.skinType}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Add Batch Modal */}
        <Modal
          title="Add New Batch"
          open={addBatchModalVisible}
          onCancel={() => {
            setAddBatchModalVisible(false);
            form.resetFields();
          }}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleAddBatch}>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[
                { required: true, message: "Please input quantity" },
                {
                  type: "number",
                  min: 1,
                  message: "Quantity must be greater than 0",
                },
              ]}
            >
              <InputNumber className="w-full" placeholder="Enter quantity" />
            </Form.Item>

            <Form.Item
              name="manufactureDate"
              label="Manufacture Date"
              rules={[
                { required: true, message: "Please select manufacture date" },
              ]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              name="expirationDate"
              label="Expiration Date"
              rules={[
                { required: true, message: "Please select expiration date" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || !getFieldValue("manufactureDate")) {
                      return Promise.resolve();
                    }
                    if (value.isBefore(getFieldValue("manufactureDate"))) {
                      return Promise.reject(
                        "Expiration date must be after manufacture date"
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => {
                  setAddBatchModalVisible(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Add Batch
              </Button>
            </div>
          </Form>
        </Modal>

        {/* View Batches Modal */}
        <Modal
          title="Batch List"
          open={viewBatchesModalVisible}
          onCancel={() => setViewBatchesModalVisible(false)}
          footer={null}
          width={800}
        >
          <Table
            columns={batchColumns}
            dataSource={batches}
            rowKey="id"
            loading={batchesLoading}
            pagination={{
              total: batches.length,
              pageSize: 10,
              showSizeChanger: false,
            }}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ProductDetail;
