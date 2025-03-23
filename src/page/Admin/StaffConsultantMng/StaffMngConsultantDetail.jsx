import React, { useEffect, useState } from "react";
import { Button, Card, Descriptions, Spin, Tag, Select } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { instance } from "../../../service/instance";
import { getAllExperts, getBookingById } from "../../../service/booking";

const { Option } = Select;

export default function StaffMngConsultantDetail() {
  const [loading, setLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchOrderDetail();
    fetchExperts();
  }, []);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await getBookingById(id);
      if (!response) {
        throw new Error("Có lỗi trong việc tải dữ liệu đơn hàng");
      }
      setOrderDetail(response.bookingOrder);
      console.log(response.bookingOrder)
    } catch (error) {
      toast.error("Lỗi", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const data = await getAllExperts();
      setExperts(data);
    } catch (err) {
      console.error("Failed to fetch experts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTask = async () => {
    if (!selectedExpert) {
      toast.error("Vui lòng chọn một chuyên gia!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await instance.post(
        `/admin/booking-order/${id}`,
        { expertId: selectedExpert },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Đã giao nhiệm vụ cho đơn hàng #${id}`);
      fetchOrderDetail(); // Cập nhật lại chi tiết
    } catch (error) {
      console.error("Lỗi khi giao nhiệm vụ:", error);
      toast.error("Không thể giao nhiệm vụ!");
    } finally {
      setLoading(false);
    }
  };

  const getExpertName = (expertId) => {
    const expert = experts.find((exp) => exp.id === expertId);
    return expert
      ? `${expert.lastName || ""} ${expert.firstName || ""}`.trim()
      : "N/A";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!orderDetail) {
    return <div>Không tìm thấy đơn hàng</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button
          icon={<LeftOutlined />}
          onClick={() => navigate("/admin/staff-manage-consultant-order")}
          className="mr-3"
        >
          Quay lại
        </Button>
        <h2 className="text-2xl font-bold">Chi Tiết Đơn Tư Vấn</h2>
      </div>

      <Card className="mb-6">
        <Descriptions title="Thông tin đơn hàng" bordered>
          <Descriptions.Item label="Mã Đơn">{orderDetail.id}</Descriptions.Item>
          <Descriptions.Item label="Tổng Tiền">
            {orderDetail.price?.toLocaleString("vi-VN") || "Chưa cập nhật"} VND
          </Descriptions.Item>
          <Descriptions.Item label="Ngày Đặt Đơn">
            {orderDetail.orderDate
              ? new Date(orderDetail.orderDate).toLocaleString("vi-VN")
              : "N?A"}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng Thái Thanh Toán">
            <Tag color={orderDetail.paymentStatus === "PAID" ? "green" : "red"}>
              {orderDetail.paymentStatus === "PAID"
                ? "Đã Thanh Toán"
                : "Chưa Thanh Toán"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng Thái Đơn">
            <Tag color={getBookingStatusColor(orderDetail.status)}>
              {orderDetail.status || "Không xác định"}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card className="mb-6">
        <Descriptions title="Thông tin khách hàng" bordered>
          <Descriptions.Item label="Họ Tên Khách Hàng">
            {`${orderDetail.firstName || "Không có"} ${
              orderDetail.lastName || ""
            }`.trim() || "Không xác định"}
          </Descriptions.Item>
          <Descriptions.Item label="Độ Tuổi">
            {orderDetail.age || "Không có"}
          </Descriptions.Item>
          <Descriptions.Item label="Loại Da">
            {orderDetail.skinType || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Dị Ứng">
            {orderDetail.allergy || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Tình Trạng Da">
            {orderDetail.skinCondition || "Không có"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card className="mb-6">
        <div className="mb-4 text-lg font-semibold">Phân Tư Vấn Viên</div>
        {orderDetail.expertName ? (
          <Descriptions bordered >
            <Descriptions.Item label="Tư vấn viên">
              {getExpertName(orderDetail.expertName)}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <>
            <Select
              style={{ width: "100%", marginBottom: 16 }}
              value={selectedExpert}
              onChange={setSelectedExpert}
              placeholder="Chọn chuyên gia"
              loading={!experts.length && loading}
            >
              {experts.map((expert) => (
                <Option key={expert.id} value={expert.id}>
                  {`${expert.lastName || ""} ${
                    expert.firstName || ""
                  }`.trim() || "Chưa có tên"}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              onClick={handleAssignTask}
              loading={loading}
              disabled={!selectedExpert}
              className="w-full md:w-auto px-8 h-12 rounded-md bg-blue-600 hover:bg-blue-700"
            >
              Giao Nhiệm Vụ
            </Button>
          </>
        )}
      </Card>

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
