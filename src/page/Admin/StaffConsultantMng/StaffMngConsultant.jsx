import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Spin,
  message,
  Modal,
  Descriptions,
  Select,
} from "antd";

import { useNavigate } from "react-router-dom";
import { instance } from "../../../service/instance";

const { Option } = Select;
export default function StaffMngConsultant() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Bạn chưa đăng nhập! Vui lòng đăng nhập lại.");
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

      console.log("Booking Orders:", response);

      const result = response?.data?.result ?? response?.result ?? [];

      if (Array.isArray(result)) {
        const validOrders = result.filter(
          (order) =>
            order && typeof order === "object" && order.id !== undefined
        );
        setOrders(validOrders);
        filterOrders(validOrders, paymentFilter);
        if (validOrders.length === 0) {
          message.warning("Không có đơn hàng hợp lệ.");
        }
      } else {
        setOrders([]);
        setFilteredOrders([]);
        message.warning("Không có đơn hàng nào hoặc dữ liệu không hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      if (error.response?.status === 401) {
        message.error("Phiên đăng nhập hết hạn!");
        navigate("/login");
      } else {
        message.error("Không thể tải danh sách đơn hàng!");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchExperts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.get("/booking-order/filter-expert", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const expertList = response?.data?.result ?? response?.result ?? [];
      setExperts(Array.isArray(expertList) ? expertList : []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chuyên gia:", error);
      message.error("Không thể tải danh sách chuyên gia!");
    }
  };

  const filterOrders = (orderList, filter) => {
    if (filter === "ALL") {
      setFilteredOrders(orderList);
    } else {
      setFilteredOrders(
        orderList.filter((order) => order.paymentStatus === filter)
      );
    }
  };

  const handlePaymentFilterChange = (value) => {
    setPaymentFilter(value);
    filterOrders(orders, value);
  };

  const showModal = (order) => {
    setSelectedOrder(order);
    setSelectedExpert(order?.expertName || null); // Pré-remplir si déjà assigné
    fetchExperts(); // Charger les experts quand le modal s'ouvre
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
    setSelectedExpert(null);
    setExperts([]);
  };

  const handleAssignTask = async () => {
    if (!selectedExpert) {
      message.error("Vui lòng chọn một chuyên gia!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await instance.post(
        `/admin/booking-order/${selectedOrder.id}`,
        { expertId: selectedExpert },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success(`Đã giao nhiệm vụ cho đơn hàng #${selectedOrder.id}`);
      fetchOrders(); // Rafraîchir la liste après assignation
      handleCancel();
    } catch (error) {
      console.log(selectedExpert);
      console.error("Lỗi khi giao nhiệm vụ:", error);
      message.error("Không thể giao nhiệm vụ!");
    }
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
      render: (_, record) => {
        const fullName = `${record?.firstName || "Không có"} ${
          record?.lastName || ""
        }`.trim();
        return fullName || "Không xác định";
      },
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
          {status === "PAID"
            ? "Đã Thanh Toán"
            : status
            ? "Chưa Thanh Toán"
            : "Không xác định"}
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
        date
          ? new Date(date).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "Không có",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => showModal(record)}
          disabled={!record?.id}
        >
          Xem Chi Tiết
        </Button>
      ),
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

  return (
    <div style={{ padding: 20 }}>
      <h2>Danh Sách Đơn Hàng</h2>

      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 8 }}>Lọc theo trạng thái thanh toán: </span>
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

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      ) : filteredOrders.length > 0 ? (
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey={(record) => record?.id ?? Math.random().toString()}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
        />
      ) : (
        <p>Không có đơn hàng nào.</p>
      )}

      <Modal
        title={`Chi Tiết Đơn Hàng #${selectedOrder?.id || "Không xác định"}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button
            key="assign"
            type="primary"
            onClick={handleAssignTask}
            disabled={!selectedExpert}
          >
            Giao Nhiệm Vụ
          </Button>,
          <Button key="close" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {selectedOrder && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Mã Đơn">
              {selectedOrder.id ?? "Không xác định"}
            </Descriptions.Item>
            <Descriptions.Item label="Tên Khách Hàng">
              {`${selectedOrder.firstName || "Không có"} ${
                selectedOrder.lastName || ""
              }`.trim() || "Không xác định"}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng Tiền">
              {selectedOrder.price !== undefined && selectedOrder.price !== null
                ? `${Number(selectedOrder.price).toLocaleString("vi-VN")} VND`
                : "Chưa cập nhật"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng Thái Thanh Toán">
              <Tag
                color={selectedOrder.paymentStatus === "PAID" ? "green" : "red"}
              >
                {selectedOrder.paymentStatus === "PAID"
                  ? "Đã Thanh Toán"
                  : "Chưa Thanh Toán"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng Thái Booking">
              <Tag color={getBookingStatusColor(selectedOrder.status)}>
                {selectedOrder.status || "Không xác định"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày Đặt">
              {selectedOrder.orderDate
                ? new Date(selectedOrder.orderDate).toLocaleDateString("vi-VN")
                : "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi Chú">
              {selectedOrder.note || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Loại Da">
              {selectedOrder.skinType || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Dị Ứng">
              {selectedOrder.allergy || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Tình Trạng Da">
              {selectedOrder.skinCondition || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Tên Chuyên Gia">
              <Select
                style={{ width: "100%" }}
                value={selectedExpert}
                onChange={setSelectedExpert}
                placeholder="Chọn chuyên gia"
              >
                {experts.map((expert) => (
                  <Select.Option key={expert.id} value={expert.id}>
                    {`${expert.firstName || ""} ${
                      expert.lastName || ""
                    }`.trim()}
                  </Select.Option>
                ))}
              </Select>
            </Descriptions.Item>

            <Descriptions.Item label="Tuổi">
              {selectedOrder.age ?? "Không xác định"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
