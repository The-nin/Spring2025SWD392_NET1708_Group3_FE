import React, { useState, useEffect } from "react";
import OrderDetail from "./MyOrderedDetail.jsx";
import { getOrderHistory } from "../../../service/order/index.js";
import { format } from "date-fns";

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrderHistory(currentPage);
        setOrders(response.result.orderResponseList);
        setTotalPages(response.result.totalPages);
      } catch (err) {
        setError("Không thể tải đơn hàng");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-white w-full max-w-full border rounded-md">
      {selectedOrder ? (
        <OrderDetail
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
        />
      ) : (
        <div>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Bạn chưa có đơn hàng nào
            </div>
          ) : (
            <>
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="border-b pb-4 mb-4 last:border-0 cursor-pointer hover:bg-gray-100 p-4"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">
                      Đơn hàng #{order.orderId}
                    </span>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 text-white rounded ${
                          order.status === "COMPLETED"
                            ? "bg-green-600"
                            : order.status === "DELIVERING"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {order.status === "COMPLETED"
                          ? "Hoàn thành"
                          : order.status === "DELIVERING"
                          ? "Đang giao hàng"
                          : "Đang xử lý"}
                      </span>
                      <span
                        className={`px-2 py-1 text-white rounded ${
                          order.paymentStatus === "PAID"
                            ? "bg-green-600"
                            : "bg-orange-500"
                        }`}
                      >
                        {order.paymentStatus === "PAID"
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    📅 {format(new Date(order.orderDate), "dd/MM/yyyy HH:mm")}
                  </p>
                  <div className="mt-2">
                    <p className="text-gray-700">
                      Phương thức thanh toán: {order.paymentMethod}
                    </p>
                    <p className="text-gray-700">
                      Địa chỉ giao hàng: {order.address.addressLine}
                    </p>
                  </div>
                  <p className="text-right font-semibold text-lg">
                    Tổng tiền: {order.totalAmount.toLocaleString()} đ
                  </p>
                </div>
              ))}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                  >
                    ← Trước
                  </button>
                  <span>
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Tiếp →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
