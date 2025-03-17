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

  const fetchOrders = async (
    page = pagination.current,
    pageSize = pagination.pageSize
  ) => {
    try {
      setLoading(true);
      const response = await getOrderAdmin({
        page: page - 1, // BE thường expect page bắt đầu từ 0
        size: pageSize,
      });

      if (response && response.code === 200) {
        setOrders(response.result.orderResponseList);
        setPagination({
          current: response.result.pageNumber + 1, // BE trả về pageNumber từ 0
          pageSize: response.result.pageSize,
          total: response.result.totalElements,
        });
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getFilteredData = () => {
    let filteredData = [...orders];

    // Filter by keyword
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filteredData = filteredData.filter(
        (order) =>
          order.orderId.toString().toLowerCase().includes(keyword) ||
          order.address.name.toLowerCase().includes(keyword) ||
          order.username.toLowerCase().includes(keyword)
      );
    }

    // Filter by status
    if (filters.status) {
      filteredData = filteredData.filter(
        (order) => order.status === filters.status
      );
    }

    // Filter by payment status
    if (filters.paymentStatus) {
      filteredData = filteredData.filter(
        (order) => order.paymentStatus === filters.paymentStatus
      );
    }

    // Sort data
    if (filters.sortBy && filters.order) {
      filteredData.sort((a, b) => {
        let aValue = a[filters.sortBy];
        let bValue = b[filters.sortBy];

        // Handle nested fields (e.g., address.name)
        if (filters.sortBy === "customerName") {
          aValue = a.address.name;
          bValue = b.address.name;
        }

        // Handle date comparison
        if (filters.sortBy === "orderDate") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (filters.order === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filteredData;
  };

  const handleTableChange = (newPagination, tableFilters, sorter) => {
    const newFilters = { ...filters };

    // Update sorting
    if (sorter.field) {
      newFilters.sortBy = sorter.field;
      newFilters.order = sorter.order === "ascend" ? "asc" : "desc";
    } else {
      newFilters.sortBy = "";
      newFilters.order = "";
    }

    setFilters(newFilters);
    // Gọi API với trang mới
    fetchOrders(newPagination.current, newPagination.pageSize);
  };

  // Xử lý search
  const handleSearch = (value) => {
    setFilters({
      ...filters,
      keyword: value,
    });
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  // Xử lý filter status
  const handleStatusFilter = (value) => {
    setFilters({
      ...filters,
      status: value,
    });
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  // Xử lý filter payment status
  const handlePaymentStatusFilter = (value) => {
    setFilters({
      ...filters,
      paymentStatus: value,
    });
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const getCurrentPageData = () => {
    let filteredData = [...orders];

    // Filter by keyword
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filteredData = filteredData.filter(
        (order) =>
          order.orderId.toString().toLowerCase().includes(keyword) ||
          order.address.name.toLowerCase().includes(keyword) ||
          order.username.toLowerCase().includes(keyword)
      );
    }

    // Filter by status
    if (filters.status) {
      filteredData = filteredData.filter(
        (order) => order.status === filters.status
      );
    }

    // Filter by payment status
    if (filters.paymentStatus) {
      filteredData = filteredData.filter(
        (order) => order.paymentStatus === filters.paymentStatus
      );
    }

    // Sort data
    if (filters.sortBy && filters.order) {
      filteredData.sort((a, b) => {
        let aValue = a[filters.sortBy];
        let bValue = b[filters.sortBy];

        if (filters.sortBy === "customerName") {
          aValue = a.address.name;
          bValue = b.address.name;
        }

        if (filters.sortBy === "orderDate") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (filters.order === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return {
      data: filteredData,
      total: filteredData.length,
    };
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
      title: "Mã đơn hàng",
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
      title: "Tên khách hàng",
      dataIndex: ["address", "name"],
      key: "customerName",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: true,
      render: (amount) => `$${amount.toLocaleString()}`,
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      sorter: true,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <span className={status === "PAID" ? "text-green-600" : "text-red-600"}>
          {status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color;
        let statusText;

        switch (status) {
          case "PENDING":
            color = "text-yellow-500";
            statusText = "Chờ xử lý";
            break;
          case "PROCESSING":
            color = "text-blue-500";
            statusText = "Đang xử lý";
            break;
          case "DONE":
            color = "text-green-600";
            statusText = "Hoàn thành";
            break;
          case "DELIVERING":
            color = "text-purple-500";
            statusText = "Đang giao hàng";
            break;
          case "DELIVERY_FAILED":
            color = "text-orange-600";
            statusText = "Giao hàng thất bại";
            break;
          case "CANCELLED":
            color = "text-red-600";
            statusText = "Đã hủy";
            break;
          default:
            color = "text-gray-500";
            statusText = status;
        }
        return <span className={color}>{statusText}</span>;
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
      </div>
      <div className="mb-4 flex gap-4">
        <Input.Search
          placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng hoặc tên đăng nhập"
          onSearch={handleSearch}
          style={{ width: 300 }}
          allowClear
        />
        <Select
          placeholder="Lọc theo trạng thái"
          style={{ width: 200 }}
          allowClear
          onChange={handleStatusFilter}
          value={filters.status}
        >
          <Select.Option value="PENDING">Chờ xử lý</Select.Option>
          <Select.Option value="PROCESSING">Đang xử lý</Select.Option>
          <Select.Option value="DONE">Hoàn thành</Select.Option>
          <Select.Option value="DELIVERING">Đang giao hàng</Select.Option>
          <Select.Option value="DELIVERY_FAILED">
            Giao hàng thất bại
          </Select.Option>
          <Select.Option value="CANCELLED">Đã hủy</Select.Option>
        </Select>
        <Select
          placeholder="Lọc theo trạng thái thanh toán"
          style={{ width: 200 }}
          allowClear
          onChange={handlePaymentStatusFilter}
          value={filters.paymentStatus}
        >
          <Select.Option value="PAID">Đã thanh toán</Select.Option>
          <Select.Option value="NOT_PAID">Chưa thanh toán</Select.Option>
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={getCurrentPageData().data}
        rowKey="orderId"
        pagination={{
          ...pagination,
          total: getCurrentPageData().total,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} mục`,
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
