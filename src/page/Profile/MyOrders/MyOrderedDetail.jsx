import React from "react";

const MyOrderedDetail = ({ order, onBack }) => {
  if (!order) return null;

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
            <strong>Customer name:</strong> {order.address.name}
          </p>
          <p className="text-gray-700">
            <strong>Phone number:</strong> {order.address.phone}
          </p>
          <p className="text-gray-700">
            <strong>Address:</strong> {order.address.addressLine}
          </p>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="p-4 bg-gray-100 rounded-md">
          <p className="text-gray-700">
            <strong>Order number:</strong> #{order.orderId}
          </p>
          <p className="text-gray-700">
            <strong>Order date:</strong>{" "}
            {new Date(order.orderDate).toLocaleDateString()}
          </p>
          <p className="text-gray-700">
            <strong>Order status:</strong> {order.status}
          </p>
          <p className="text-gray-700">
            <strong>Payment method:</strong> {order.paymentMethod}
          </p>
          {order.paymentStatus && (
            <p className="text-gray-700">
              <strong>Payment status:</strong> {order.paymentStatus}
            </p>
          )}
        </div>
      </div>

      {order.orderInfo && (
        <div className="text-center mt-4 bg-gray-100 p-2 rounded-md">
          {order.orderInfo}
        </div>
      )}

      {/* Chi tiết sản phẩm */}
      {order.orderResponseItemList && (
        <>
          <h3 className="text-lg font-semibold mt-4 bg-neutral-300 p-2 rounded-md">
            Product Details
          </h3>
          <div className="p-4">
            {order.orderResponseItemList.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center">
                  <img
                    src={item.productImage || "placeholder-image-url"}
                    alt={item.productName}
                    className="w-12 h-12 object-cover rounded mr-4"
                  />
                  <span>
                    {item.productName} x {item.quantity}
                  </span>
                </div>
                <span className="font-semibold">
                  {(item.price * item.quantity).toLocaleString()} đ
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Tổng tiền */}
      <div className="mt-4 p-4">
        <p className="flex justify-between font-semibold text-lg">
          <span>Total:</span>
          <span>{order.totalAmount.toLocaleString()} đ</span>
        </p>
      </div>

      {order.status === "PENDING" && (
        <div className="mt-4 flex justify-end">
          <button className="px-6 py-1 bg-neutral-600 hover:bg-neutral-800 text-white rounded">
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
};

export default MyOrderedDetail;
