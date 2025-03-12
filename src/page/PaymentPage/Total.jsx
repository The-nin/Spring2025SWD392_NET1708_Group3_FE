import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const Total = ({
  buttonText,
  onNext,
  cartData,
  onVoucherApply,
  appliedVoucher: initialAppliedVoucher,
  vouchers,
}) => {
  console.log("Total received props:", {
    buttonText,
    cartData,
    vouchers,
    appliedVoucher: initialAppliedVoucher,
  });

  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(initialAppliedVoucher);
  const [voucherError, setVoucherError] = useState("");

  useEffect(() => {
    setAppliedVoucher(initialAppliedVoucher);
  }, [initialAppliedVoucher]);

  const handleNext = () => {
    if (cartData) {
      onNext(cartData.cartId, appliedVoucher?.code);
    }
  };

  const handleApplyVoucher = () => {
    setVoucherError("");
    if (!voucherCode) {
      setVoucherError("Vui lòng chọn voucher");
      return;
    }

    const selectedVoucher = vouchers.find((v) => v.code === voucherCode);
    if (!selectedVoucher) {
      setVoucherError("Không tìm thấy voucher");
      return;
    }

    if (!cartData) {
      setVoucherError("Không thể áp dụng voucher khi chưa có giỏ hàng");
      return;
    }

    if (cartData.totalPrice < selectedVoucher.minOrderValue) {
      setVoucherError(
        `Đơn hàng tối thiểu ${selectedVoucher.minOrderValue.toLocaleString(
          "vi-VN"
        )}đ để sử dụng voucher này`
      );
      return;
    }

    setAppliedVoucher(selectedVoucher);
    onVoucherApply(selectedVoucher);
    setVoucherCode("");
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    onVoucherApply(null);
    setVoucherError("");
  };

  const calculateFinalPrice = () => {
    if (!cartData) return 0;
    if (!appliedVoucher) return cartData.totalPrice;

    return Math.max(0, cartData.totalPrice - appliedVoucher.discount);
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
          <p>
            {appliedVoucher
              ? `${appliedVoucher.discount.toLocaleString("vi-VN")}đ`
              : "0đ"}
          </p>
        </div>
        <div className="flex justify-between text-sm">
          <p>Vận chuyển</p>
          <p>Miễn phí</p>
        </div>
      </div>

      {/* Voucher Select Section */}
      <div className="my-4">
        <div className="flex space-x-2">
          <select
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900"
            disabled={!vouchers?.length || appliedVoucher}
          >
            <option value="">Chọn voucher</option>
            {vouchers?.map((voucher) => (
              <option key={voucher.id} value={voucher.code}>
                {voucher.code} - {voucher.description}
                (Giảm {voucher.discount.toLocaleString("vi-VN")}đ)
              </option>
            ))}
          </select>
          {!appliedVoucher ? (
            <button
              onClick={handleApplyVoucher}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400"
              disabled={!voucherCode || !vouchers?.length}
            >
              Áp dụng
            </button>
          ) : (
            <button
              onClick={handleRemoveVoucher}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              ✕
            </button>
          )}
        </div>
        {voucherError && (
          <p className="text-red-600 text-sm mt-2">{voucherError}</p>
        )}
        {appliedVoucher && (
          <p className="text-green-600 text-sm mt-2">
            Đã áp dụng mã giảm giá: {appliedVoucher.code}
          </p>
        )}
      </div>

      <hr className="my-4" />
      <div className="flex justify-between font-semibold text-[#17183B]">
        <p>Tổng Tiền</p>
        <p>
          {cartData
            ? `${calculateFinalPrice().toLocaleString("vi-VN")}đ`
            : "Đang tải..."}
        </p>
      </div>
      {/* <p className="text-sm text-gray-500 mt-2 flex justify-between">
        Dự kiến giao hàng vào ngày{" "}
        <span className="font-semibold">01 tháng 02 năm 2025</span>
      </p> */}
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
  cartData: PropTypes.object,
  onVoucherApply: PropTypes.func.isRequired,
  appliedVoucher: PropTypes.object,
  vouchers: PropTypes.array,
};

export default Total;
