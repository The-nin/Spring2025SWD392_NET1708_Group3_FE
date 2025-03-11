import PropTypes from "prop-types";
import Total from "../Total";

const Shipping = ({ onNext, selectedAddressId, cartData }) => {
  const handleContinue = (cartId) => {
    if (!selectedAddressId) {
      alert("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    onNext(cartId, selectedAddressId);
  };

  return (
    <div className=" grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h2 className="text-xl font-semibold mb-6">Phương thức vận chuyển</h2>

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
                <p className="font-semibold">Miễn phí</p>
                <p className="text-sm text-gray-600">Vận chuyển thường</p>
              </div>
            </div>
          </label>
        </div>

        {/* Priority Shipping Option */}
        {/* <div className="border rounded-lg p-4 mb-3 hover:border-gray-900 cursor-pointer">
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
        </div> */}

        {/* Schedule Option */}
        {/* <div className="border rounded-lg p-4 hover:border-gray-900 cursor-pointer">
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
        </div> */}
      </div>

      <Total
        buttonText="Tiếp tục thanh toán"
        onNext={handleContinue}
        cartData={cartData}
      />
    </div>
  );
};

Shipping.propTypes = {
  onNext: PropTypes.func.isRequired,
  selectedAddressId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  cartData: PropTypes.object,
};

export default Shipping;
