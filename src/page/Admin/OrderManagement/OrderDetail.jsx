import React, { useEffect, useState } from "react";
import { Card, Descriptions, Table, Tag, Spin, Button } from "antd";
import { getOrderDetail } from "../../../service/order"; // Assuming this is your API service
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LeftOutlined } from "@ant-design/icons";

const OrderDetail = () => {
  const [loading, setLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const { id } = useParams(); // Get order ID from URL params
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await getOrderDetail(id);
      if (response && response.code === 200) {
        setOrderDetail(response.result);
      } else {
        toast.error("Failed to fetch order details");
      }
    } catch (error) {
      toast.error("Error loading order details");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toLocaleString()}`,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `$${price.toLocaleString()}`,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!orderDetail) {
    return <div>No order details found</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button
          icon={<LeftOutlined />}
          onClick={() => navigate("/admin/order")}
          className="mr-4"
        >
          Back to Orders
        </Button>
        <h2 className="text-2xl font-bold m-0">Order Details</h2>
      </div>

      <Card className="mb-6">
        <Descriptions title="Order Information" bordered>
          <Descriptions.Item label="Order ID">
            {orderDetail.orderId}
          </Descriptions.Item>
          <Descriptions.Item label="Total Amount">
            ${orderDetail.totalAmount.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Username">
            {orderDetail.username}
          </Descriptions.Item>
          <Descriptions.Item label="Order Date">
            {new Date(orderDetail.orderDate).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Method">
            {orderDetail.paymentMethod}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Status">
            <Tag color={orderDetail.paymentStatus === "PAID" ? "green" : "red"}>
              {orderDetail.paymentStatus}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Order Status">
            {orderDetail.status || "PENDING"}
          </Descriptions.Item>
          <Descriptions.Item label="Order Info" span={3}>
            {orderDetail.orderInfo}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card className="mb-6">
        <Descriptions title="Shipping Address" bordered>
          <Descriptions.Item label="Name">
            {orderDetail.address.name}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {orderDetail.address.phone}
          </Descriptions.Item>
          <Descriptions.Item label="City">
            {orderDetail.address.city}
          </Descriptions.Item>
          <Descriptions.Item label="Address" span={3}>
            {orderDetail.address.addressLine}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Order Items">
        <Table
          columns={columns}
          dataSource={orderDetail.orderResponseItemList}
          rowKey="productName"
          pagination={false}
        />
      </Card>

      <ToastContainer />
    </div>
  );
};

export default OrderDetail;
