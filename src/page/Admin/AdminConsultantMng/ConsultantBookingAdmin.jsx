import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Table } from "antd";
import { getAllBooking } from "../../../service/booking";

function ConsultantBookingAdmin() {
  const [orderBooking, setOrderBooking] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllOrder = async () => {
    try {
      setLoading(true);
      const response = await getAllBooking();

      if (!response) {
        throw new Error("Có lỗi trong việc tải dữ liệu đơn hàng");
      }

      setOrderBooking(response);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrder();
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
  ];

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quản lý dịch vụ khách hàng</h2>
      </div>

      <Table dataSource={orderBooking} columns={columns} loading={loading} />
    </div>
  );
}

export default ConsultantBookingAdmin;
