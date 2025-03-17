import React from "react";

const MyOrderedDetail = ({ order, onBack }) => {
  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <button
        onClick={onBack}
        className="text-sky-700 hover:text-sky-900 mb-6 flex items-center gap-2 transition-colors"
      >
        <span>&larr;</span>
        <span>Quay lại danh sách đơn hàng</span>
      </button>

      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Đơn hàng #{order.orderId}
        </h2>
        <p className="text-gray-600">
          Đặt ngày {new Date(order.orderDate).toLocaleDateString()}
        </p>
      </div>

      {/* Order Status Banner */}
      <div
        className={`mb-6 p-4 rounded-lg ${
          order.status === "PENDING"
            ? "bg-yellow-50 text-yellow-700"
            : order.status === "COMPLETED"
            ? "bg-green-50 text-green-700"
            : "bg-gray-50 text-gray-700"
        }`}
      >
        <div className="font-semibold">
          Trạng thái:{" "}
          {order.status === "PENDING"
            ? "Đang xử lý"
            : order.status === "COMPLETED"
            ? "Hoàn thành"
            : order.status}
        </div>
        {order.orderInfo && (
          <div className="mt-2 text-sm">{order.orderInfo}</div>
        )}
      </div>

      {/* Customer and Order Info Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Thông tin khách hàng
          </h3>
          <div className="space-y-3">
            <p className="flex justify-between">
              <span className="text-gray-600">Họ tên:</span>
              <span className="font-medium">{order.address.name}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Số điện thoại:</span>
              <span className="font-medium">{order.address.phone}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Địa chỉ:</span>
              <span className="font-medium">{order.address.addressLine}</span>
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Thông tin thanh toán
          </h3>
          <div className="space-y-3">
            <p className="flex justify-between">
              <span className="text-gray-600">Phương thức thanh toán:</span>
              <span className="font-medium">{order.paymentMethod}</span>
            </p>
            {order.paymentStatus && (
              <p className="flex justify-between">
                <span className="text-gray-600">Trạng thái thanh toán:</span>
                <span
                  className={`font-medium ${
                    order.paymentStatus === "PAID"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.paymentStatus === "PAID"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Product List */}
      {order.orderResponseItemList && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Danh sách sản phẩm
          </h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            {order.orderResponseItemList.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border-b last:border-0"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.thumbnailProduct || "placeholder-image-url"}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {item.productName}
                    </h4>
                    <p className="text-gray-600">Số lượng: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-800">
                  {(item.price * item.quantity).toLocaleString()} đ
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total and Actions */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-bold text-gray-800">Tổng tiền</span>
          <span className="text-xl font-bold text-gray-800">
            {order.totalAmount.toLocaleString()} đ
          </span>
        </div>

        {order.status === "PENDING" && (
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              Hủy đơn hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrderedDetail;
