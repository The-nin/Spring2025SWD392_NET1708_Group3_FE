import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Modal, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {
  getOrderAdmin,
  deleteOrder,
  updateOrderStatus,
} from "../../../service/order";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const OrderManagement = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getOrderAdmin(
        params.page || pagination.current,
        params.pageSize || pagination.pageSize
      );

      if (response && response.code === 200) {
        setOrders(response.result.orderResponseList);
        setPagination({
          current: response.result.pageNumber + 1,
          pageSize: response.result.pageSize,
          total: response.result.totalElements,
        });
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchOrders({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const response = await updateOrderStatus(orderId, newStatus);
      if (response && response.code === 200) {
        toast.success("Order status updated successfully!");
        fetchOrders();
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      toast.error("Error updating order status");
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (order) => {
    setSelectedOrder(order);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;
    try {
      setLoading(true);
      const response = await deleteOrder(selectedOrder.orderId);
      if (response && response.code === 200) {
        toast.success("Order deleted successfully!");
        fetchOrders();
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      toast.error("Error deleting order");
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setSelectedOrder(null);
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (orderId) => (
        <a
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/orders/${orderId}`);
          }}
        >
          {orderId}
        </a>
      ),
    },
    {
      title: "Customer Name",
      dataIndex: ["address", "name"],
      key: "customerName",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `$${amount.toLocaleString()}`,
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <span className={status === "PAID" ? "text-green-600" : "text-red-600"}>
          {status}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status || "PENDING"}
          onChange={(value) => handleStatusChange(record.orderId, value)}
          style={{ width: 120 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Select.Option value="PENDING">Pending</Select.Option>
          <Select.Option value="PROCESSING">Processing</Select.Option>
          <Select.Option value="DONE">Done</Select.Option>
          <Select.Option value="DELIVERING">Delivering</Select.Option>
          <Select.Option value="CANCELLED">Cancelled</Select.Option>
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Order Management</h2>
      </div>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="orderId"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () => navigate(`/admin/orders/${record.orderId}`),
          style: { cursor: "pointer" },
        })}
      />
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedOrder(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete order #{selectedOrder?.orderId}?</p>
        <p>This action cannot be undone.</p>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default OrderManagement;
