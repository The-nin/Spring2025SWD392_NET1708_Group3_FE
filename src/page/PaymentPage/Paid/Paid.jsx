import PropTypes from "prop-types";
import visaicon from "../../../assets/img/visa.png";
import mastercardicon from "../../../assets/img/mastercard.png";
import Total from "../Total";
import { useState } from "react";
import { checkout } from "../../../service/checkout";
import { useNavigate } from "react-router-dom";

const Paid = ({ selectedAddressId, cartId }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("VNPAY");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleOrder = async () => {
    setIsLoading(true);
    try {
      const checkoutData = {
        addressId: parseInt(selectedAddressId),
        cartId: parseInt(cartId),
        paymentMethod: selectedPaymentMethod,
      };

      const response = await checkout(checkoutData);

      if (!response.error) {
        console.log(selectedPaymentMethod);
        if (selectedPaymentMethod === "VNPAY" && response.result.redirectUrl) {
          // window.location.href = response.result.redirectUrl;
          console.log(response.result.redirectUrl);
        } else {
          navigate("/order-success", {
            state: {
              orderId: response.result.orderId,
            },
          });
        }
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi đặt hàng");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h2 className="text-xl font-semibold mb-6">Phương thức thanh toán</h2>

        {/* VNPAY Option */}
        <div className="border rounded-lg p-4 mb-3 hover:border-gray-900 cursor-pointer">
          <label className="flex items-center space-x-4 cursor-pointer">
            <input
              type="radio"
              name="payment"
              className="h-5 w-5 text-gray-900"
              defaultChecked
              value="VNPAY"
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
              disabled={isLoading}
            />
            <div className="flex justify-between w-full">
              <div className="flex items-center space-x-3">
                <div className="font-semibold">VNPAY</div>
                <p className="text-sm text-gray-600">Thanh toán qua VNPAY</p>
              </div>
            </div>
          </label>
        </div>

        {/* COD Option */}
        <div className="border rounded-lg p-4 hover:border-gray-900 cursor-pointer">
          <label className="flex items-center space-x-4 cursor-pointer">
            <input
              type="radio"
              name="payment"
              className="h-5 w-5 text-gray-900"
              value="COD"
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
              disabled={isLoading}
            />
            <div className="flex justify-between w-full">
              <div className="flex items-center space-x-3">
                <div className="font-semibold">COD</div>
                <p className="text-sm text-gray-600">
                  Thanh toán khi nhận hàng
                </p>
              </div>
            </div>
          </label>
        </div>
      </div>

      <Total
        buttonText={isLoading ? "Đang xử lý..." : "Đặt hàng"}
        onNext={handleOrder}
        disabled={isLoading}
      />
    </div>
  );
};

Paid.propTypes = {
  selectedAddressId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  cartId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Paid;
