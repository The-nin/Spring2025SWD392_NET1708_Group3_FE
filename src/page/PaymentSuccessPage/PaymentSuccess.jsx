// import { useEffect, useState, useCallback } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { Card, Typography, Spin, Alert, Button, message } from "antd";

// const { Text, Title } = Typography;

// export default function PaymentSuccess() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [paymentStatus, setPaymentStatus] = useState({
//     isSuccessful: false,
//     bookingOrderId: 0,
//   });

//   const checkPaymentStatus = useCallback(async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("❌ Không tìm thấy token!");

//       const bookingOrderIdStr = searchParams.get("vnp_TxnRef");
//       const transactionStatus = searchParams.get("vnp_TransactionStatus");

//       if (!bookingOrderIdStr || !transactionStatus) {
//         throw new Error("⚠️ URL không có đủ thông tin thanh toán!");
//       }

//       const bookingOrderId = Number(bookingOrderIdStr);
//       const isPaymentSuccessful = transactionStatus === "00";

//       if (isNaN(bookingOrderId) || bookingOrderId <= 0) {
//         throw new Error("⚠️ Mã giao dịch không hợp lệ!");
//       }

//       const response = await fetch(
//         "http://localhost:8080/api/v1/swd392-skincare-products-sales-system/booking-order/updateStatus",
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             bookingOrderId,
//             isPaid: isPaymentSuccessful,
//           }),
//         }
//       );

//       const data = await response.json();
//       setPaymentStatus({
//         isSuccessful: isPaymentSuccessful,
//         bookingOrderId,
//       });

//       message.success(
//         isPaymentSuccessful
//           ? "🎉 Thanh toán thành công!"
//           : "⚠️ Thanh toán không được xác nhận!"
//       );
//     } catch (err) {
//       console.error("❌ Lỗi khi kiểm tra thanh toán:", err);
//       message.error(err.message || "Không thể xác minh trạng thái thanh toán!");
//       setPaymentStatus({
//         isSuccessful: false,
//         bookingOrderId: 0,
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     checkPaymentStatus();
//   }, [checkPaymentStatus]);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-amber-100 p-4">
//         <Spin size="large" className="text-amber-800" />
//         <Text className="text-amber-900 mt-2">
//           Đang kiểm tra và cập nhật trạng thái thanh toán...
//         </Text>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-amber-100 p-4">
//       <Card
//         bordered={false}
//         className="max-w-lg w-full text-center bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300"
//       >
//         <Title level={2} className="mb-6 text-amber-900 font-bold text-3xl">
//           {paymentStatus.isSuccessful
//             ? "🎉 Thanh toán thành công!"
//             : "❌ Thanh toán thất bại!"}
//         </Title>

//         <Alert
//           message={
//             paymentStatus.isSuccessful
//               ? "Thanh toán đã được xác nhận!"
//               : "Giao dịch thất bại!"
//           }
//           description={
//             paymentStatus.isSuccessful
//               ? `Mã giao dịch: ${paymentStatus.bookingOrderId}`
//               : paymentStatus.bookingOrderId === 0
//               ? "Không tìm thấy thông tin thanh toán."
//               : "Thanh toán không thành công hoặc bị hủy."
//           }
//           type={paymentStatus.isSuccessful ? "success" : "error"}
//           showIcon
//           className="mb-6 rounded-xl text-left p-4 bg-gray-50"
//         />

//         <div className="mt-8">
//           <Text className="text-gray-700 text-base mb-4 block">
//             Vui lòng kiểm tra trong lịch sử đặt hàng.
//           </Text>
//           <div className="flex justify-center gap-4">
//             <Button
//               type="primary"
//               size="large"
//               className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
//               onClick={() => navigate("/")}
//             >
//               Trang chủ
//             </Button>
//             {!paymentStatus.isSuccessful && (
//               <Button
//                 type="default"
//                 size="large"
//                 className="bg-amber-200 hover:bg-amber-300 text-amber-800 font-medium px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
//                 onClick={() => navigate("/checkout")}
//               >
//                 Thử lại
//               </Button>
//             )}
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, Typography, Spin, Alert, Button, message } from "antd";

const { Text, Title } = Typography;

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
      if (!token) throw new Error("❌ Không tìm thấy token!");

      const bookingOrderIdStr = searchParams.get("vnp_TxnRef");
      const transactionStatus = searchParams.get("vnp_TransactionStatus");

      if (!bookingOrderIdStr || !transactionStatus) {
        throw new Error("⚠️ URL không có đủ thông tin thanh toán!");
      }

      const bookingOrderId = Number(bookingOrderIdStr);
      const isPaymentSuccessful = transactionStatus === "00";

      if (isNaN(bookingOrderId) || bookingOrderId <= 0) {
        throw new Error("⚠️ Mã giao dịch không hợp lệ!");
      }

      const response = await fetch(
        "http://localhost:8080/api/v1/swd392-skincare-products-sales-system/booking-order/update-status",
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

      const data = await response.json();
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-amber-100 p-4">
        <Spin size="large" className="text-amber-800" />
        <Text className="text-amber-900 mt-2">
          Đang kiểm tra và cập nhật trạng thái thanh toán...
        </Text>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-amber-100 p-4">
      <Card
        bordered={false}
        className="max-w-lg w-full text-center bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300"
      >
        <Title level={2} className="mb-6 text-amber-900 font-bold text-3xl">
          {paymentStatus.isSuccessful
            ? "🎉 Thanh toán thành công!"
            : "❌ Thanh toán thất bại!"}
        </Title>

        <Alert
          message={
            paymentStatus.isSuccessful
              ? "Thanh toán đã được xác nhận!"
              : "Giao dịch thất bại!"
          }
          description={
            paymentStatus.isSuccessful
              ? `Mã giao dịch: ${paymentStatus.bookingOrderId}`
              : paymentStatus.bookingOrderId === 0
              ? "Không tìm thấy thông tin thanh toán."
              : "Thanh toán không thành công hoặc bị hủy."
          }
          type={paymentStatus.isSuccessful ? "success" : "error"}
          showIcon
          className="mb-6 rounded-xl text-left p-4 bg-gray-50"
        />

        <div className="mt-8">
          <Text className="text-gray-700 text-base mb-4 block">
            Vui lòng kiểm tra trong lịch sử đặt hàng.
          </Text>
          <div className="flex justify-center gap-4">
            <Button
              type="primary"
              size="large"
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => navigate("/")}
            >
              Trang chủ
            </Button>
            {!paymentStatus.isSuccessful && (
              <Button
                type="default"
                size="large"
                className="bg-amber-200 hover:bg-amber-300 text-amber-800 font-medium px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => navigate("/checkout")}
              >
                Thử lại
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
