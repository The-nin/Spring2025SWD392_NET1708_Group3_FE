import React from "react";

const OrderDetail = ({ order, customer, onBack }) => {
  if (!order || !customer) return null;

  return (
    <div className="">
      <button
        onClick={onBack}
        className="text-sky-700 hover:text-gray-800 mb-4 flex items-center"
      >
        &larr; Back
      </button>
      <div className="text-lg font-semibold mt-4 bg-neutral-300 p-2 rounded-md">
        Order Details
      </div>
      <div className="grid grid-cols-2 gap-4 p-3 bg-gray-100 rounded-md">
        {/* Thông tin khách hàng */}
        <div className="p-4 bg-gray-100 rounded-md">
          <p className="text-gray-700">
            <strong>Customer name:</strong> {customer.name}
          </p>
          <p className="text-gray-700">
            <strong>Phone number:</strong> {customer.phone}
          </p>
          <p className="text-gray-700">
            <strong>Address:</strong> {customer.address}, {customer.ward},{" "}
            {customer.district}, {customer.city}
          </p>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="p-4 bg-gray-100 rounded-md">
          <p className="text-gray-700">
            <strong>Order number:</strong> #{order.id}{" "}
          </p>
          <p className="text-gray-700">
            <strong>Order date:</strong> {order.date}
          </p>
          <p className="text-gray-700">
            <strong>Order status:</strong> {order.status}
          </p>
          <p className="text-gray-700">
            <strong>Payment method:</strong> VN Pay
          </p>
        </div>
      </div>

      {/* Ghi chú */}
      <div className="text-center mt-4 bg-gray-100 p-2 rounded-md">
        Hàng dễ vỡ, đặt tiền, gọi điện rồi xuống nhận hàng
      </div>

      {/* Chi tiết sản phẩm */}
      <h3 className="text-lg font-semibold mt-4 bg-neutral-300 p-2 rounded-md">
        Product Details
      </h3>
      <div className="p-4">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <div className="flex items-center">
              <img
                src="https://hoatuongvyspa.com/upload/product/sua-rua-mat-sinh-hoc-amytas-952.png" // Placeholder hình ảnh
                alt={item.name}
                className="w-12 h-12 object-cover rounded mr-4"
              />
              <span>
                {item.name} x {item.quantity}
              </span>
            </div>
            <span className="font-semibold">
              {(item.price * item.quantity).toLocaleString()} đ
            </span>
          </div>
        ))}
      </div>

      {/*Tổng tiền */}
      <div className="mt-4 p-4">
        <p className="flex justify-between">
          <span>Discount:</span>
          <span className="text-red-500">-10.000đ</span>
        </p>
        <p className="flex justify-between font-semibold text-lg">
          <span>Total:</span>
          <span>{order.total.toLocaleString()} đ</span>
        </p>
      </div>

      {/*hủy đơn hàng */}
      <div className="mt-4 flex justify-end">
        <button className="px-6 py-1 bg-neutral-600 hover:bg-neutral-800 text-white rounded">
          Cancel Order
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
