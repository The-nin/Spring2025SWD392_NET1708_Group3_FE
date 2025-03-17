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
  Popconfirm,
} from "antd";
import {
  ArrowLeftOutlined,
  InboxOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getProductById } from "../../../service/productManagement";
import {
  addNewBatch,
  getBatches,
  deleteBatch,
} from "../../../service/productManagement/index";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addBatchModalVisible, setAddBatchModalVisible] = useState(false);
  const [viewBatchesModalVisible, setViewBatchesModalVisible] = useState(false);
  const [batches, setBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [deletingBatch, setDeletingBatch] = useState(false);
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
        toast.error("Không thể tải thông tin sản phẩm");
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
      toast.error(error.message);
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
        toast.success("Thêm lô hàng thành công");
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
      toast.error("Không thể thêm lô hàng");
    }
  };

  const handleViewBatches = () => {
    setViewBatchesModalVisible(true);
    fetchBatches();
  };

  const handleDeleteBatch = async (batchId) => {
    setDeletingBatch(true);
    try {
      const response = await deleteBatch(batchId);
      if (!response.error) {
        toast.success(response.message);
        // Refresh batches list
        fetchBatches();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingBatch(false);
    }
  };

  const batchColumns = [
    {
      title: "Mã lô hàng",
      dataIndex: "batchCode",
      key: "batchCode",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Ngày sản xuất",
      dataIndex: "manufactureDate",
      key: "manufactureDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Xóa lô hàng này?"
          description="Bạn có chắc chắn muốn xóa lô hàng này? Hành động này không thể hoàn tác."
          onConfirm={() => handleDeleteBatch(record.id)}
          okText="Có"
          cancelText="Không"
          okButtonProps={{ loading: deletingBatch }}
        >
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            loading={deletingBatch}
          >
            Xóa
          </Button>
        </Popconfirm>
      ),
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
          Quay lại Sản phẩm
        </Button>

        <div className="flex justify-end mb-4">
          <Space>
            <Button
              type="primary"
              icon={<InboxOutlined />}
              onClick={handleViewBatches}
            >
              Xem lô hàng
            </Button>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => setAddBatchModalVisible(true)}
            >
              Thêm lô hàng mới
            </Button>
          </Space>
        </div>

        <Card title="Chi tiết sản phẩm" className="w-full shadow-md">
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
                  title="Thông tin cơ bản"
                  column={2}
                  className="bg-white p-4 rounded-lg"
                >
                  <Descriptions.Item label="Tên sản phẩm" span={2}>
                    {product.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giá">
                    {product.price?.toLocaleString("vi-VN")}đ
                  </Descriptions.Item>
                  <Descriptions.Item label="Tồn kho">
                    {product.stock || 0}
                  </Descriptions.Item>
                  <Descriptions.Item label="Danh mục">
                    {product.category?.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thương hiệu">
                    {product.brand?.name}
                  </Descriptions.Item>
                </Descriptions>
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-b pb-4">
                  <h3 className="font-bold text-lg mb-4 text-gray-800">
                    Mô tả
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
                    Thành phần
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
                    Hướng dẫn sử dụng
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
                    Thông số kỹ thuật
                  </h3>
                  <Descriptions
                    column={2}
                    bordered
                    className="bg-white rounded-lg"
                  >
                    <Descriptions.Item label="Xuất xứ">
                      {product.specification.origin}
                    </Descriptions.Item>
                    <Descriptions.Item label="Xuất xứ thương hiệu">
                      {product.specification.brandOrigin}
                    </Descriptions.Item>
                    <Descriptions.Item label="Nơi sản xuất">
                      {product.specification.manufacturingLocation}
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại da">
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
          title="Thêm lô hàng mới"
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
              label="Số lượng"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng" },
                {
                  type: "number",
                  min: 1,
                  message: "Số lượng phải lớn hơn 0",
                },
              ]}
            >
              <InputNumber className="w-full" placeholder="Nhập số lượng" />
            </Form.Item>

            <Form.Item
              name="manufactureDate"
              label="Ngày sản xuất"
              rules={[
                { required: true, message: "Vui lòng chọn ngày sản xuất" },
              ]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              name="expirationDate"
              label="Ngày hết hạn"
              rules={[
                { required: true, message: "Vui lòng chọn ngày hết hạn" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || !getFieldValue("manufactureDate")) {
                      return Promise.resolve();
                    }
                    if (value.isBefore(getFieldValue("manufactureDate"))) {
                      return Promise.reject(
                        "Ngày hết hạn phải sau ngày sản xuất"
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
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Thêm lô hàng
              </Button>
            </div>
          </Form>
        </Modal>

        {/* View Batches Modal */}
        <Modal
          title="Danh sách lô hàng"
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
      <ToastContainer />
    </div>
  );
};

export default ProductDetail;
