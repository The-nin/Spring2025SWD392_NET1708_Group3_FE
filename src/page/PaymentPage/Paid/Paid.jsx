import PropTypes from "prop-types";
import visaicon from "../../../assets/img/visa.png";
import mastercardicon from "../../../assets/img/mastercard.png";

const Paid = ({ onNext }) => {
  return (
    <div className=" grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

        {/* Visa Card Option */}
        <div className="border rounded-lg p-4 mb-3 hover:border-gray-900 cursor-pointer">
          <label className="flex items-center space-x-4 cursor-pointer">
            <input
              type="radio"
              name="payment"
              className="h-5 w-5 text-gray-900"
              defaultChecked
            />
            <div className="flex justify-between w-full">
              <div className="flex items-center space-x-3">
                <img src={visaicon} alt="visa" className="h-8" />
                <div>
                  <p className="font-semibold">•••• 6754</p>
                  <p className="text-sm text-gray-600">Expires 06/2021</p>
                </div>
              </div>
              <button className="text-gray-900 font-semibold">Remove</button>
            </div>
          </label>
        </div>

        {/* Mastercard Option */}
        <div className="border rounded-lg p-4 hover:border-gray-900 cursor-pointer">
          <label className="flex items-center space-x-4 cursor-pointer">
            <input
              type="radio"
              name="payment"
              className="h-5 w-5 text-gray-900"
            />
            <div className="flex justify-between w-full">
              <div className="flex items-center space-x-3">
                <img src={mastercardicon} alt="mastercard" className="h-8" />
                <div>
                  <p className="font-semibold">•••• 5643</p>
                  <p className="text-sm text-gray-600">Expires 11/2025</p>
                </div>
              </div>
              <button className="text-gray-900 font-semibold">Remove</button>
            </div>
          </label>
        </div>

        {/* Add Payment Method Button */}
        <button className="flex items-center text-gray-900 mt-4">
          <span className="text-xl mr-2">+</span>
          Add Payment method
        </button>
      </div>

      {/* Order Summary */}
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
            Place Your Order and Pay
          </button>
        </div>
      </div>
    </div>
  );
};

Paid.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Paid;
