import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tooltip } from "antd";
import { toast } from "react-toastify";
import { getAllConsultantBookingByExpert } from "../../../service/booking";

function ExpertService() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchBookOrder = async () => {
    try {
      setLoading(true);
      const response = await getAllConsultantBookingByExpert();

      const formattedOrders = response.map((item) => ({
        ...item.bookingOrder,
        imageSkin: item.imageSkin,
      }));

      if (!response) {
        throw new Error("Có lỗi trong việc tải dữ liệu đơn hàng");
      }

      const sortedOrders = formattedOrders.sort((a, b) => {
        return new Date(b.orderDate) - new Date(a.orderDate);
      });

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Thất bại trong việc lấy dữ liệu đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookOrder();
  }, []);

  const formatDate = (orderDate) => {
    const date = new Date(orderDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (serviceName) => (serviceName ? serviceName : "N/A"),
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (text, record) => `${record.lastName} ${record.firstName}`, // Combine lastName and firstName
    },
    {
      title: "Ngày dặt lịch",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (orderDate) => formatDate(orderDate),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (price ? `${price.toLocaleString()} VNĐ` : "N/A"),
    },
    {
      title: "Mô tả",
      dataIndex: "skinCondition",
      key: "skinCondition",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (paymentStatus) =>
        paymentStatus ? "Thanh toán" : "Chưa thanh toán",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quản lý dịch vụ khách hàng</h2>
      </div>

      <Table
        dataSource={orders}
        columns={columns}
        loading={loading}
        onRow={(record) => ({
          onClick: () =>
            navigate(`/admin/consultant-booking/order-detail/${record.id}`),
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
}

export default ExpertService;
