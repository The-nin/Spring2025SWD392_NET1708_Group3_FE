import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaCheckCircle, FaShoppingBag, FaRegCreditCard } from "react-icons/fa";
import { confirmPaymentSuccess } from "../../../../service/checkout";

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Lấy toàn bộ URL callback từ VNPay (bao gồm cả query string)
        const fullCallbackUrl = window.location.href;
        const queryString = location.search; // Phần query string của URL

        console.log("Full callback URL:", fullCallbackUrl);
        console.log("Query string:", queryString);

        // Lấy các thông tin quan trọng để hiển thị
        const queryParams = new URLSearchParams(location.search);
        const responseCode = queryParams.get("vnp_ResponseCode");
        const orderInfo = queryParams.get("vnp_OrderInfo");
        const orderId =
          queryParams.get("orderId") || queryParams.get("vnp_TxnRef");

        // Lưu thông tin để hiển thị
        setPaymentDetails({
          orderId,
          orderInfo,
          responseCode,
          // Các thông tin khác nếu cần
        });

        if (responseCode === "00" || !responseCode) {
          toast.success("Thanh toán thành công!");

          try {
            // Gọi API với query string từ VNPay
            console.log(
              "Calling payment-success API with query string:",
              queryString
            );

            const paymentResponse = await confirmPaymentSuccess(queryString);

            console.log("Payment success API response:", paymentResponse);

            if (!paymentResponse.error) {
              toast.success("Đã cập nhật trạng thái đơn hàng thành công");
            } else {
              toast.error(
                paymentResponse.message ||
                  "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng"
              );
            }
          } catch (confirmError) {
            console.error("Payment success API error:", confirmError);
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
          }
        } else {
          toast.error("Thanh toán thất bại!");
        }
      } catch (error) {
        console.error("Payment processing error:", error);
        toast.error("Có lỗi xảy ra trong quá trình xử lý thanh toán");
      } finally {
        setLoading(false);
      }
    };

    processPayment();
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

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
              transition={{
                scale: { duration: 0.5 },
                rotate: { duration: 0.5, delay: 0.5 },
              }}
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
            >
              <FaCheckCircle className="text-green-600 text-5xl" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-light text-gray-900 mb-3">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-600">
            Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đang được xử lý và sẽ
            được giao trong thời gian sớm nhất.
          </p>
        </div>

        <div className="border-t border-b border-gray-200 py-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Thông tin thanh toán</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mr-4">
                  <FaRegCreditCard />
                </span>
                <span className="text-gray-600">Phương thức thanh toán</span>
              </div>
              <span className="font-medium">VNPay</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <Link
            to="/shop"
            className="flex-1 bg-black hover:bg-gray-800 text-white py-3 rounded-lg flex items-center justify-center transition-colors"
          >
            <FaShoppingBag className="mr-2" />
            Tiếp tục mua sắm
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
