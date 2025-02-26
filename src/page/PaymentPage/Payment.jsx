import { useState } from "react";
import Address from "./Address/Address";
import Shipping from "./Shipping/Shipping";
import Paid from "./Paid/Paid";

const Payment = () => {
  const [step, setStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [cartId, setCartId] = useState(null);

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

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Address onNext={handleAddressNext} />;
      case 2:
        return (
          <Shipping
            onNext={handleShippingNext}
            selectedAddressId={selectedAddressId}
          />
        );
      case 3:
        return (
          <Paid
            onNext={handlePaidNext}
            selectedAddressId={selectedAddressId}
            cartId={cartId}
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
          Address
        </span>
        <span className="text-gray-500">&gt;</span>
        <span
          className={`cursor-pointer ${
            step >= 2 ? "text-black font-bold" : "text-gray-500"
          }`}
          onClick={() => step >= 2 && setStep(2)}
        >
          Shipping
        </span>
        <span className="text-gray-500">&gt;</span>
        <span
          className={`cursor-pointer ${
            step === 3 ? "text-black font-bold" : "text-gray-500"
          }`}
          onClick={() => step === 3 && setStep(3)}
        >
          Payment
        </span>
      </div>

      {/* Step Content */}
      {renderStepContent()}
    </div>
  );
};

export default Payment;
