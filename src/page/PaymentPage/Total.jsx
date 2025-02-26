import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getCart } from "../../service/cart/cart";

const Total = ({ buttonText, onNext }) => {
  const [cartData, setCartData] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      const response = await getCart();
      if (!response.error) {
        setCartData(response.result);
      }
    };
    fetchCartData();
  }, []);

  const handleNext = () => {
    if (cartData) {
      onNext(cartData.cartId);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-lg font-bold mb-4 text-[#17183B]">Tạm Tính</h2>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <p>Thành Tiền</p>
          <p>
            {cartData
              ? `${cartData.totalPrice.toLocaleString("vi-VN")}đ`
              : "Đang tải..."}
          </p>
        </div>
        <div className="flex justify-between text-sm">
          <p>Giảm Giá</p>
          <p>0đ</p>
        </div>
        <div className="flex justify-between text-sm">
          <p>Vận chuyển</p>
          <p>Miễn phí</p>
        </div>
        <div className="flex justify-between text-sm">
          <p>Mã giảm giá sử dụng</p>
          <p>0đ</p>
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex justify-between font-semibold text-[#17183B]">
        <p>Tổng Tiền</p>
        <p>
          {cartData
            ? `${cartData.totalPrice.toLocaleString("vi-VN")}đ`
            : "Đang tải..."}
        </p>
      </div>
      <p className="text-sm text-gray-500 mt-2 flex justify-between">
        Dự kiến giao hàng vào ngày{" "}
        <span className="font-semibold">01 tháng 02 năm 2025</span>
      </p>
      <div className="mt-4">
        <button
          className="w-full font-semibold bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-500"
          onClick={handleNext}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

Total.propTypes = {
  buttonText: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default Total;
