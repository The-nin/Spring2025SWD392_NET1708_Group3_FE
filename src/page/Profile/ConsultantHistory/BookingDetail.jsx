/* eslint-disable react/prop-types */
function BookingDetail({ order, onBack }) {
  if (!order) return null;

  const transSkintype = (skinType) => {
    switch (skinType) {
      case "NORMAL_SKIN":
        return "Da thường";
      case "OILY_SKIN":
        return "Da dầu";
      case "SENSITIVE_SKIN":
        return "Da nhạy cảm";
      case "DRY_SKIN":
        return "Da khô";
      case "COMBINATION_SKIN":
        return "Da hỗn hợp";
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <button
        onClick={onBack}
        className="text-sky-700 hover:text-sky-900 mb-6 flex items-center gap-2 transition-colors"
      >
        <span>&larr;</span>
        <span>Quay lại</span>
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Đơn #{order.id}
        </h2>
        <p className="text-gray-600">
          Đặt lịch: {new Date(order.orderDate).toLocaleDateString()}
        </p>
      </div>

      <div
        className={`mb-6 p-4 rounded-lg ${
          order.status === "PENDING"
            ? "bg-yellow-50 text-yellow-700"
            : order.status === "COMPLETED"
            ? "bg-green-50 text-green-700"
            : "bg-gray-50 text-gray-700"
        }`}
      >
        <div className="font-semibold">Trạng thái: {order.status}</div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Thông tin khách hàng
          </h3>
          <div className="space-y-3">
            <p className="flex justify-between">
              <span className="text-gray-600">Họ và tên:</span>
              <span className="font-medium">
                {order.lastName} {order.firstName}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Tuổi:</span>
              <span className="font-medium">{order.age}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Loại da:</span>
              <span className="font-medium">
                {transSkintype(order.skinType)}
              </span>
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
              <span className="font-medium">VnPay</span>
            </p>
            {order.paymentStatus && (
              <p className="flex justify-between">
                <span className="text-gray-600">Tình trạng thanh toán:</span>
                <span
                  className={`font-medium ${
                    order.paymentStatus === "PAID"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.paymentStatus === "PAID"
                    ? "Đã thanh toán"
                    : order.paymentStatus === "NOT_PAID"
                    ? "Chưa Thanh toán"
                    : "Đang tải"}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* {order.routine && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Các bước chăm sóc da
            </h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              {order.routine.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border-b last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.productImage || "placeholder-image-url"}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {item.productName}
                      </h4>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {(item.price * item.quantity).toLocaleString()} đ
                  </span>
                </div>
              ))}
            </div>
          </div>
        )} */}

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-bold text-gray-800">Tổng giá</span>
          <span className="text-xl font-bold text-gray-800">
            {order.price.toLocaleString()} VNĐ
          </span>
        </div>

        {order.status === "PENDING" && (
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              Cancel Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingDetail;
