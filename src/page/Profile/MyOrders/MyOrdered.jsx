import React, { useState, useEffect } from "react";
import OrderDetail from "./MyOrderedDetail.jsx";
import AddressBook from "../AddressBook/AddressBook.jsx";

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;

  // Danh sách đơn hàng mẫu
  const orders = Array.from({ length: 5 }, (_, i) => ({
    id: `27145${i}`,
    status: i % 2 === 0 ? "COMPLETED" : "PENDING",
    date: "27/05/2024",
    items: [
      { name: " Sua rua mat", price: 575000, quantity: 1 },
      { name: "Kem chong nắng", price: 559000, quantity: 1 },
    ],
    total: 1134000,
    delivery: "Shipping in progress...",
  }));

  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      const storedAddresses = [
        {
          id: 1,
          name: "Tuấn Anh",
          phone: "0123456789",
          city: "Hồ Chí Minh",
          district: "Quận 9",
          ward: "Phường Long Bình",
          address: "Vinhomes Grand Park Origami S7.03",
          default: true, // Địa chỉ mặc định
        },
      ];
      setAddresses(storedAddresses);
    };

    fetchAddresses();
  }, []);

  // Lấy địa chỉ mặc định
  const defaultAddress = addresses.find((addr) => addr.default) || addresses[0];

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="p-6 bg-white w-full max-w-full border rounded-md">
      {selectedOrder ? (
        <OrderDetail
          order={selectedOrder}
          customer={defaultAddress}
          onBack={() => setSelectedOrder(null)}
        />
      ) : (
        <div>
          {currentOrders.map((order, index) => (
            <div
              key={index}
              className="border-b pb-4 mb-4 last:border-0 cursor-pointer hover:bg-gray-100 p-4"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">#{order.id}</span>
                <span
                  className={`px-2 py-1 text-white rounded ${
                    order.status === "COMPLETED"
                      ? "bg-green-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600">📅 {order.date}</p>
              <ul className="mt-2">
                {order.items.map((item, i) => (
                  <li key={i} className="text-gray-800">
                    {item.name} - {item.quantity} x{" "}
                    {item.price.toLocaleString()} đ
                  </li>
                ))}
              </ul>
              <p className="text-neutral-600 mt-2">✔ {order.delivery}</p>
              <p className="text-right font-semibold text-lg">
                Total: {order.total.toLocaleString()} đ
              </p>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              ← Previous
            </button>
            <span>
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
