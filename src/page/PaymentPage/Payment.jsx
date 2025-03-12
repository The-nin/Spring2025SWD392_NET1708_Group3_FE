import { useState, useEffect } from "react";
import Address from "./Address/Address";
import Shipping from "./Shipping/Shipping";
import Paid from "./Paid/Paid";
import { getCart } from "../../service/cart/cart";
import { getMyVouchers } from "../../service/voucher/index";

const Payment = () => {
  const [step, setStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [cartData, setCartData] = useState(null);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [vouchers, setVouchers] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [cartResponse, vouchersResponse] = await Promise.all([
        getCart(),
        getMyVouchers(),
      ]);

      console.log("Cart response structure:", cartResponse);
      console.log("Vouchers response structure:", vouchersResponse);

      if (cartResponse.code === 200) {
        setCartData(cartResponse.result);
      }

      if (vouchersResponse.code === 200) {
        setVouchers(vouchersResponse.result.content);
        console.log(
          "Vouchers data to be set:",
          vouchersResponse.result.content
        );
      }
    };
    fetchData();
  }, []);

  const handleAddressNext = (cartId, addressId) => {
    console.log("Payment received - cartId:", cartId, "addressId:", addressId);
    setCartId(cartId);
    setSelectedAddressId(addressId);
    setStep(2);
  };

  const handleShippingNext = (cartId, addressId) => {
    console.log(
      "Shipping to Payment - cartId:",
      cartId,
      "addressId:",
      addressId
    );
    setStep(3);
  };

  const handlePaidNext = (cartId, addressId) => {
    // Xử lý bước thanh toán
    console.log("Processing payment...");
  };

  const handleVoucherApply = (voucher) => {
    setAppliedVoucher(voucher);
  };

  const renderStepContent = () => {
    const commonProps = {
      cartData,
      onVoucherApply: handleVoucherApply,
      appliedVoucher,
      vouchers,
    };

    console.log("Props being passed:", {
      cartData: cartData,
      vouchers: vouchers,
    });

    switch (step) {
      case 1:
        return <Address onNext={handleAddressNext} {...commonProps} />;
      case 2:
        return (
          <Shipping
            onNext={handleShippingNext}
            selectedAddressId={selectedAddressId}
            {...commonProps}
          />
        );
      case 3:
        return (
          <Paid
            onNext={handlePaidNext}
            selectedAddressId={selectedAddressId}
            cartId={cartId}
            {...commonProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto p-10">
      {/* Breadcrumb Navigation */}
      <div className="flex space-x-2 mb-6 text-xl">
        <span
          className={`cursor-pointer ${
            step >= 1 ? "text-black font-bold" : "text-gray-500"
          }`}
          onClick={() => step >= 1 && setStep(1)}
        >
          Địa chỉ
        </span>
        <span className="text-gray-500">&gt;</span>
        <span
          className={`cursor-pointer ${
            step >= 2 ? "text-black font-bold" : "text-gray-500"
          }`}
          onClick={() => step >= 2 && setStep(2)}
        >
          Vận chuyển
        </span>
        <span className="text-gray-500">&gt;</span>
        <span
          className={`cursor-pointer ${
            step === 3 ? "text-black font-bold" : "text-gray-500"
          }`}
          onClick={() => step === 3 && setStep(3)}
        >
          Thanh toán
        </span>
      </div>

      {/* Step Content */}
      {renderStepContent()}
    </div>
  );
};

export default Payment;
