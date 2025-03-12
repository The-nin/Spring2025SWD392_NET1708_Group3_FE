import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, Typography, Spin, Alert, Button, message } from "antd";

const { Text } = Typography;

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState({
    isSuccessful: false,
    bookingOrderId: 0,
  });

  const checkPaymentStatus = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("❌ Unauthorized: Không tìm thấy token!");

      const bookingOrderIdStr = searchParams.get("vnp_TxnRef");
      if (!bookingOrderIdStr)
        throw new Error("⚠️ Thiếu mã giao dịch trong URL!");

      const bookingOrderId = Number(bookingOrderIdStr);
      if (isNaN(bookingOrderId) || bookingOrderId <= 0) {
        throw new Error("⚠️ Mã giao dịch không hợp lệ!");
      }

      const transactionStatus = searchParams.get("vnp_TransactionStatus");
      const isPaymentSuccessful = transactionStatus === "00";

      console.log("📌 Booking Order ID:", bookingOrderId);
      console.log("📌 Transaction Status:", transactionStatus);
      console.log("✅ Thanh toán thành công:", isPaymentSuccessful);

      const response = await fetch(
        "http://localhost:8080/api/v1/swd392-skincare-products-sales-system/booking-order/updateStatus",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingOrderId,
            isPaid: isPaymentSuccessful,
          }),
        }
      );

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("❌ Phản hồi từ server không hợp lệ!");
      }

      if (!response.ok || data?.result !== "Thành công") {
        throw new Error(data?.message || "❌ Cập nhật trạng thái thất bại!");
      }

      setPaymentStatus({
        isSuccessful: isPaymentSuccessful,
        bookingOrderId,
      });

      message.success(
        isPaymentSuccessful
          ? "🎉 Thanh toán thành công!"
          : "⚠️ Thanh toán không được xác nhận!"
      );
    } catch (err) {
      console.error("❌ Lỗi khi kiểm tra thanh toán:", err);
      message.error(err.message || "Không thể xác minh trạng thái thanh toán!");

      setPaymentStatus({
        isSuccessful: false,
        bookingOrderId: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    checkPaymentStatus();
  }, [checkPaymentStatus]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
        <p>Đang kiểm tra và cập nhật trạng thái thanh toán...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: "auto", marginTop: 50 }}>
      <Card
        bordered={false}
        style={{ textAlign: "center", background: "#f0f2f5", padding: 20 }}
      >
        {paymentStatus.isSuccessful ? (
          <Alert
            message="✅ Thanh toán thành công!"
            description={`Mã giao dịch: ${paymentStatus.bookingOrderId}`}
            type="success"
            showIcon
          />
        ) : (
          <Alert
            message="❌ Thanh toán thất bại!"
            description={
              paymentStatus.bookingOrderId === 0
                ? "Thiếu thông tin thanh toán hoặc mã giao dịch không hợp lệ."
                : "Thanh toán không thành công hoặc bị hủy."
            }
            type="error"
            showIcon
          />
        )}

        <div style={{ marginTop: 20 }}>
          <Text>Vui lòng kiểm tra trong lịch sử đặt hàng.</Text>
          <br />
          <Button
            type="primary"
            onClick={() => navigate("/")}
            style={{ marginTop: 10 }}
          >
            Quay về trang chủ
          </Button>
          {!paymentStatus.isSuccessful && (
            <Button
              type="default"
              onClick={() => navigate("/checkout")}
              style={{ marginTop: 10, marginLeft: 10 }}
            >
              Thử lại thanh toán
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
