import { useEffect, useState } from "react";
import { Button, message } from "antd";
import BookingDetail from "./BookingDetail";
import { format } from "date-fns";
import {
  createPayment,
  getAllBookingByUser,
  getAllExperts,
} from "../../../service/booking";
import { getServices } from "../../../service/serviceManagement";

export default function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [experts, setExperts] = useState([]);
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const response = await getAllExperts();
      setExperts(response);
    } catch (error) {
      console.error("Failed to fetch experts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await getServices();
      setServices(response);
    } catch (error) {
      console.error("Failed to fetch experts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await getAllBookingByUser();
      setData(response);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        error.response?.data?.message || error.message || "Lỗi hệ thống"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
    fetchServices();
    fetchOrder();
  }, []);

  const getExpertNameById = (expertId) => {
    const expert = experts.find((e) => e.id === expertId);
    return expert ? `${expert.lastName} ${expert.firstname}` : "Đang tải...";
  };

  const handlePayment = async (bookingOrderID) => {
    try {
      const response = await createPayment(bookingOrderID);
      const redirectUrl = response.redirectUrl;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        message.error("Không lấy được URL thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      message.error("Thanh toán thất bại!");
    }
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const handlePageScroll = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-white w-full max-w-full border rounded-md">
      {selectedBooking ? (
        <BookingDetail
          order={selectedBooking}
          onBack={() => setSelectedBooking(null)}
        />
      ) : (
        <div>
          {/* Nếu không có dữ liệu */}
          {data.length === 0 ? (
            <div className="text-center">Không có đơn đặt hàng.</div>
          ) : (
            data
              .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((book) => (
                <div
                  key={book.id}
                  className="border-b pb-4 mb-4 last:border-0 cursor-pointer hover:bg-gray-100 p-4"
                  onClick={() => setSelectedBooking(book)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">
                      #{book.id}
                    </span>
                    <span
                      className={`px-2 py-1 text-white rounded ${
                        book.status === "COMPLETED"
                          ? "bg-green-600"
                          : "bg-yellow-500"
                      }`}
                    >
                      {book.status}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    📅 {format(new Date(book.orderDate), "MM/dd/yyyy HH:mm")}
                  </p>
                  <div className="mt-2">
                    <p className="text-gray-700">
                      Tư vấn viên: {getExpertNameById(book.expertName)}
                    </p>
                    <p className="text-gray-700">Dịch vụ: {book.serviceName}</p>
                  </div>
                  <p className="text-right font-semibold text-lg">
                    Tổng giá: {book.price.toLocaleString()} VNĐ
                  </p>
                  <div>
                    <Button
                      type="dashed"
                      danger
                      onClick={() => handlePayment(book.id)}
                    >
                      Thanh toán
                    </Button>
                  </div>
                </div>
              ))
          )}

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => {
                const prevPage = Math.max(currentPage - 1, 1);
                handlePageScroll(prevPage);
              }}
              disabled={currentPage === 1 || data.length === 0}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              ← Previous
            </button>
            <span>
              {/* Hiển thị phân trang */}
              Page {data.length === 0 ? 0 : currentPage} /{" "}
              {data.length === 0 ? 0 : totalPages}
            </span>
            <button
              onClick={() => {
                const nextPage = Math.min(currentPage + 1, totalPages);
                handlePageScroll(nextPage);
              }}
              disabled={currentPage === totalPages || data.length === 0}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
