import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tooltip, Modal, Select, Input } from "antd";
import { getOrderAdmin, updateOrderStatus } from "../../../service/order";
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
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    keyword: "",
    sortBy: "",
    order: "",
    status: "",
    paymentStatus: "",
  });

  const fetchOrders = async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = {
        page: params.page !== undefined ? params.page - 1 : 0,
        size: params.pageSize || 10,
      };

      if (params.keyword) queryParams.keyword = params.keyword;
      if (params.sortBy) queryParams.sortBy = params.sortBy;
      if (params.order) queryParams.order = params.order;
      if (params.status) queryParams.status = params.status;
      if (params.paymentStatus)
        queryParams.paymentStatus = params.paymentStatus;

      const response = await getOrderAdmin(queryParams);

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

  const handleTableChange = (newPagination, tableFilters, sorter) => {
    const params = {
      ...filters,
      page: newPagination.current,
      pageSize: newPagination.pageSize,
    };

    if (sorter.field) {
      params.sortBy = sorter.field;
      params.order = sorter.order ? sorter.order.replace("end", "") : undefined;
    }

    fetchOrders(params);
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

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      sorter: true,
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
      sorter: true,
      render: (amount) => `$${amount.toLocaleString()}`,
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      sorter: true,
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
      render: (status) => {
        let color;
        switch (status) {
          case "PENDING":
            color = "text-yellow-500";
            break;
          case "PROCESSING":
            color = "text-blue-500";
            break;
          case "DONE":
            color = "text-green-600";
            break;
          case "DELIVERING":
            color = "text-purple-500";
            break;
          case "CANCELLED":
            color = "text-red-600";
            break;
          default:
            color = "text-gray-500";
        }
        return <span className={color}>{status}</span>;
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Order Management</h2>
      </div>
      <div className="mb-4 flex gap-4">
        <Input.Search
          placeholder="Search by order ID or customer name"
          onSearch={(value) => {
            const params = {
              ...filters,
              keyword: value,
              page: 1,
            };
            setFilters(params);
            fetchOrders(params);
          }}
          style={{ width: 300 }}
          allowClear
        />
        <Select
          placeholder="Filter by Status"
          style={{ width: 200 }}
          allowClear
          onChange={(value) => {
            const params = {
              ...filters,
              status: value,
              page: 1,
            };
            setFilters(params);
            fetchOrders(params);
          }}
        >
          <Select.Option value="PENDING">Pending</Select.Option>
          <Select.Option value="PROCESSING">Processing</Select.Option>
          <Select.Option value="DONE">Done</Select.Option>
          <Select.Option value="DELIVERING">Delivering</Select.Option>
          <Select.Option value="CANCELLED">Cancelled</Select.Option>
        </Select>
        <Select
          placeholder="Filter by Payment Status"
          style={{ width: 200 }}
          allowClear
          onChange={(value) => {
            const params = {
              ...filters,
              paymentStatus: value,
              page: 1,
            };
            setFilters(params);
            fetchOrders(params);
          }}
        >
          <Select.Option value="PAID">Paid</Select.Option>
          <Select.Option value="UNPAID">Unpaid</Select.Option>
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="orderId"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        loading={loading}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () => navigate(`/admin/orders/${record.orderId}`),
          style: { cursor: "pointer" },
        })}
      />
      <ToastContainer />
    </div>
  );
};

export default OrderManagement;
