import PropTypes from "prop-types";

const Shipping = ({ onNext }) => {
  return (
    <div className=" grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h2 className="text-xl font-semibold mb-6">Shipment Method</h2>

        {/* Free Shipping Option */}
        <div className="border rounded-lg p-4 mb-3 hover:border-gray-900 cursor-pointer">
          <label className="flex items-center space-x-4 cursor-pointer">
            <input
              type="radio"
              name="shipping"
              className="h-5 w-5 text-gray-900"
              defaultChecked
            />
            <div className="flex justify-between w-full">
              <div>
                <p className="font-semibold">Free</p>
                <p className="text-sm text-gray-600">Regular Shipment</p>
              </div>
              <p className="text-sm text-gray-600">01 Feb, 2023</p>
            </div>
          </label>
        </div>

        {/* Priority Shipping Option */}
        <div className="border rounded-lg p-4 mb-3 hover:border-gray-900 cursor-pointer">
          <label className="flex items-center space-x-4 cursor-pointer">
            <input
              type="radio"
              name="shipping"
              className="h-5 w-5 text-gray-900"
            />
            <div className="flex justify-between w-full">
              <div>
                <p className="font-semibold">$8.50</p>
                <p className="text-sm text-gray-600">Priority Shipping</p>
              </div>
              <p className="text-sm text-gray-600">28 Jan, 2023</p>
            </div>
          </label>
        </div>

        {/* Schedule Option */}
        <div className="border rounded-lg p-4 hover:border-gray-900 cursor-pointer">
          <label className="flex items-center space-x-4 cursor-pointer">
            <input
              type="radio"
              name="shipping"
              className="h-5 w-5 text-gray-900"
            />
            <div className="flex justify-between w-full">
              <div>
                <p className="font-semibold">Schedule</p>
                <p className="text-sm text-gray-600">
                  Choose a date that works for you.
                </p>
              </div>
              <select className="text-sm text-gray-600 border rounded-lg px-2 py-1 bg-white outline-none cursor-pointer focus:border-gray-900">
                <option>Select Date</option>
              </select>
            </div>
          </label>
        </div>
      </div>

      {/* Order Summary - Giữ nguyên phần này */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4 text-[#17183B]">Tạm Tính</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <p>Thành Tiền</p>
            <p>Rs. 700/-</p>
          </div>
          <div className="flex justify-between text-sm">
            <p>Giảm Giá</p>
            <p>Rs. 42/-</p>
          </div>
          <div className="flex justify-between text-sm">
            <p>Vận chuyển</p>
            <p>Free</p>
          </div>
          <div className="flex justify-between text-sm">
            <p>Mã giảm giá sử dụng</p>
            <p>$0.00</p>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between font-semibold text-[#17183B]">
          <p>Tổng Tiền</p>
          <p>Rs. 658/-</p>
        </div>
        <p className="text-sm text-gray-500 mt-2 flex justify-between">
          Dự kiến giao hàng vào ngày{" "}
          <span className="font-semibold">01 tháng 02 năm 2025</span>
        </p>
        <div className="mt-4">
          <button
            className="w-full font-semibold bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-500"
            onClick={onNext}
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

Shipping.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Shipping;
