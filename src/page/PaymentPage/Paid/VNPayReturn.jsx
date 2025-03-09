import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyVNPayPayment } from "../../../service/checkout";
import { toast } from "react-toastify";

const VNPayReturn = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Lấy query params từ URL callback
        const queryParams = new URLSearchParams(location.search);

        // Kiểm tra response code từ VNPay
        const responseCode = queryParams.get("vnp_ResponseCode");
        const orderInfo = queryParams.get("vnp_OrderInfo");
        const orderId = queryParams.get("vnp_TxnRef");

        // Gọi API để verify payment
        const response = await verifyVNPayPayment(location.search);

        if (response.code === 200 && responseCode === "00") {
          // Thanh toán thành công
          toast.success("Thanh toán thành công!");
          navigate("/order-success", {
            state: {
              orderId: orderId,
              message: "Thanh toán thành công!",
              orderInfo: orderInfo,
            },
          });
        } else {
          // Thanh toán thất bại
          toast.error(response.message || "Thanh toán thất bại!");
          navigate("/order-failed", {
            state: {
              message: response.message || "Thanh toán thất bại!",
              orderId: orderId,
            },
          });
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        toast.error("Có lỗi xảy ra trong quá trình xác thực thanh toán");
        navigate("/order-failed", {
          state: {
            message: "Có lỗi xảy ra trong quá trình xác thực thanh toán",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl mb-4">Đang xử lý thanh toán...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  return null;
};

export default VNPayReturn;
