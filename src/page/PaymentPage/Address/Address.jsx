import PropTypes from "prop-types";

const Address = ({ onNext }) => {
  return (
    <div className="  grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Phần Address List */}
      <div className=" lg:col-span-2 space-y-4">
        <div className="border rounded-lg p-4 hover:border-gray-900 cursor-pointer">
          <label
            className="flex items-start space-x-4 cursor-pointer"
            htmlFor="address-1"
          >
            <input
              type="radio"
              id="address-1"
              name="address"
              value="1"
              className="h-5 w-5 mt-1"
            />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className=" font-semiboldtext-lg">Lorem Ipsum</p>
                <div className="space-x-4">
                  <button className="text-gray-900 font-semibold">Edit</button>
                  <button className="text-gray-900 font-semibold">
                    Remove
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mt-1 ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <p className="text-gray-600 mt-1 ">Contact - (936) 361-0310</p>
              <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                HOME
              </span>
            </div>
          </label>
        </div>

        {/* Add New Address Button */}
        <button className="flex items-center text-gray-900 mt-4">
          <span className="text-xl mr-2">+</span>
          Add New Address
        </button>
      </div>

      {/* Phần Order Summary - Chiếm 30% */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-bold mb-4 text-[#17183B]">Tạm Tính</h2>
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
            Continue to Shipping
          </button>
        </div>
      </div>
    </div>
  );
};

Address.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Address;
