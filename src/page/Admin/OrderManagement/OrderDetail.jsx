import React, { useEffect, useState } from "react";
import { Card, Descriptions, Table, Tag, Spin, Button, Select } from "antd";
import {
  getOrderDetail,
  updateOrderStatus,
  changeToDelivery,
  updateDeliveryStatus,
  uploadToCloudinary,
} from "../../../service/order"; // Assuming this is your API service
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LeftOutlined } from "@ant-design/icons";

const OrderDetail = () => {
  const [loading, setLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const { id } = useParams(); // Get order ID from URL params
  const navigate = useNavigate();
  const [deliveryImage, setDeliveryImage] = useState(null);
  const userRole = localStorage.getItem("admin");

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

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      let response;

      if (
        (userRole === "DELIVERY_STAFF" || userRole === "ADMIN") &&
        (newStatus === "DONE" || newStatus === "DELIVERY_FAIL")
      ) {
        if (!deliveryImage) {
          toast.error("Please upload delivery image");
          return;
        }

        // Upload image to Cloudinary first
        const image = await uploadToCloudinary(deliveryImage);

        // Send the image URL to BE instead of file
        response = await updateDeliveryStatus(id, newStatus, image);
      } else if (newStatus === "DELIVERING") {
        response = await changeToDelivery(id, newStatus);
      } else {
        response = await updateOrderStatus(id, newStatus);
      }

      if (response && response.code === 200) {
        toast.success("Order status updated successfully!");
        setDeliveryImage(null);
        fetchOrderDetail();
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      toast.error("Error updating order status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableStatuses = (currentStatus) => {
    // Chỉ DELIVERY STAFF mới có thể chuyển sang DONE hoặc DELIVERY_FAIL
    if (currentStatus === "DELIVERING") {
      if (userRole === "DELIVERY_STAFF" || userRole === "ADMIN") {
        return [
          { value: "DONE", label: "Done" },
          { value: "DELIVERY_FAIL", label: "Delivery Fail" },
        ];
      }
      return []; // Admin không thể thay đổi trạng thái khi đang delivering
    }

    switch (currentStatus) {
      case "PENDING":
        return [
          { value: "PROCESSING", label: "Processing" },
          { value: "CANCELLED", label: "Cancelled" },
        ];
      case "PROCESSING":
        return [{ value: "DELIVERING", label: "Delivering" }];
      default:
        return [];
    }
  };

  const renderOrderStatus = () => {
    const statusColors = {
      PENDING: "text-yellow-500",
      PROCESSING: "text-blue-500",
      DELIVERING: "text-purple-500",
      DONE: "text-green-600",
      CANCELLED: "text-red-600",
    };

    const currentStatus = orderDetail.status || "PENDING";
    const availableStatuses = getAvailableStatuses(currentStatus);

    return (
      <div className="flex items-center gap-4">
        <span className={statusColors[currentStatus]}>{currentStatus}</span>
        {availableStatuses.length > 0 &&
          currentStatus !== "DONE" &&
          currentStatus !== "CANCELLED" && (
            <>
              <Select
                placeholder="Change status"
                style={{ width: 150 }}
                onChange={handleStatusChange}
                options={availableStatuses}
              />
              {(currentStatus === "DELIVERING" ||
                availableStatuses.some(
                  (status) =>
                    status.value === "DONE" || status.value === "DELIVERY_FAIL"
                )) &&
                (userRole === "DELIVERY_STAFF" || userRole === "ADMIN") && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setDeliveryImage(e.target.files[0])}
                    className="ml-4"
                  />
                )}
            </>
          )}
      </div>
    );
  };

  const columns = [
    {
      title: "Product Image",
      dataIndex: "thumbnailProduct",
      key: "thumbnailProduct",
      render: (thumbnailProduct) =>
        thumbnailProduct ? (
          <img
            src={thumbnailProduct}
            alt="Product thumbnail"
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
            No image
          </div>
        ),
    },
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
            {renderOrderStatus()}
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

      {orderDetail.status === "DONE" && orderDetail.imageOrderSuccess && (
        <Card title="Delivery Confirmation Image" className="mt-6">
          <img
            src={orderDetail.imageOrderSuccess}
            alt="Delivery confirmation"
            className="max-w-6xl mx-auto h-96"
          />
        </Card>
      )}

      <ToastContainer />
    </div>
  );
};

export default OrderDetail;
