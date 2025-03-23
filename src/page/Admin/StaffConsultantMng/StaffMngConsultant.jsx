import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { instance } from "../../../service/instance";

const { Option } = Select;

export default function StaffMngConsultant() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [sortInfo, setSortInfo] = useState({
    columnKey: "orderDate",
    order: "descend",
  }); // default sorting by orderDate descending
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn chưa đăng nhập! Vui lòng đăng nhập lại.");
        navigate("/login");
        setLoading(false);
        return;
      }

      const response = await instance.get(
        "/admin/booking-order/all-booking-order",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = response?.data?.result ?? response?.result ?? [];

      if (Array.isArray(result)) {
        const validOrders = result.filter(
          (order) =>
            order && typeof order === "object" && order.id !== undefined
        );
        const sortedOrders = validOrders.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        ); // Sort by latest orderDate by default
        setOrders(sortedOrders);
        filterOrders(sortedOrders, paymentFilter);
        if (validOrders.length === 0) {
          toast.warning("Không có đơn hàng hợp lệ.");
        }
      } else {
        setOrders([]);
        setFilteredOrders([]);
        toast.warning("Không có đơn hàng nào hoặc dữ liệu không hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn!");
        navigate("/login");
      } else {
        toast.error("Không thể tải danh sách đơn hàng!");
      }
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = (orderList, filter) => {
    let filteredList = orderList;
    if (filter !== "ALL") {
      filteredList = orderList.filter(
        (order) => order.paymentStatus === filter
      );
    }

    // Reapply the sorting to the filtered orders
    const sortedFilteredList = [...filteredList].sort((a, b) =>
      sortInfo.order === "ascend"
        ? new Date(a[sortInfo.columnKey]) - new Date(b[sortInfo.columnKey])
        : new Date(b[sortInfo.columnKey]) - new Date(a[sortInfo.columnKey])
    );

    setFilteredOrders(sortedFilteredList);
  };

  const handlePaymentFilterChange = (value) => {
    setPaymentFilter(value);
    filterOrders(orders, value);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSortInfo(sorter);
    filterOrders(orders, paymentFilter);
  };

  const columns = [
    {
      title: "Mã Đơn",
      dataIndex: "id",
      key: "id",
      render: (id) => id ?? "Không xác định",
    },
    {
      title: "Tên Khách Hàng",
      key: "customerName",
      render: (_, record) =>
        `${record?.firstName || "Không có"} ${record?.lastName || ""}`.trim() ||
        "Không xác định",
    },
    {
      title: "Tổng Tiền",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        price !== undefined && price !== null
          ? `${Number(price).toLocaleString("vi-VN")} VND`
          : "Chưa cập nhật",
    },
    {
      title: "Trạng Thái Thanh Toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={status === "PAID" ? "green" : "red"}>
          {status === "PAID" ? "Đã Thanh Toán" : "Chưa Thanh Toán"}
        </Tag>
      ),
    },
    {
      title: "Trạng Thái Booking",
      dataIndex: "status",
      key: "bookingStatus",
      render: (status) => (
        <Tag color={getBookingStatusColor(status)}>
          {status || "Không xác định"}
        </Tag>
      ),
    },
    {
      title: "Ngày Đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) =>
        date ? new Date(date).toLocaleString("vi-VN") : "Không có",
      sorter: true,
      sortOrder: sortInfo.columnKey === "orderDate" ? sortInfo.order : null,
    },
  ];

  const getBookingStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "blue";
      case "PENDING":
        return "orange";
      case "CANCELLED":
        return "red";
      case "COMPLETED":
        return "green";
      default:
        return "grey";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Danh Sách Đơn Tư Vấn</h2>
        <div>
          <span className="mr-2">Lọc theo trạng thái thanh toán:</span>
          <Select
            value={paymentFilter}
            onChange={handlePaymentFilterChange}
            style={{ width: 200 }}
          >
            <Option value="ALL">Tất cả</Option>
            <Option value="PAID">Đã Thanh Toán</Option>
            <Option value="UNPAID">Chưa Thanh Toán</Option>
          </Select>
        </div>
      </div>

      <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey={(record) => record?.id ?? Math.random().toString()}
        loading={loading}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () =>
            navigate(
              `/admin/staff-manage-consultant-order/detail/${record.id}`
            ),
          style: { cursor: "pointer" },
        })}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
      />

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
    </div>
  );
}
