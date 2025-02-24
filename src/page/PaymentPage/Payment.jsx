import { useState } from "react";
import Address from "./Address/Address";
import Shipping from "./Shipping/Shipping";
import Paid from "./Paid/Paid";

const Payment = () => {
  const [step, setStep] = useState(1);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Address onNext={() => setStep(2)} />;
      case 2:
        return <Shipping onNext={() => setStep(3)} />;
      case 3:
        return <Paid />;
      default:
        return null;
    }
  };

  return (
    <div className=" mx-auto p-10">
      {/* Breadcrumb Navigation */}
      <div className="flex  space-x-2 mb-6 text-xl">
        <span
          className={`cursor-pointer ${
            step >= 1 ? "text-black font-bold" : "text-gray-500"
          }`}
          onClick={() => setStep(1)}
        >
          Address
        </span>
        <span className="text-gray-500">&gt;</span>
        <span
          className={`cursor-pointer ${
            step >= 2 ? "text-black font-bold" : "text-gray-500"
          }`}
          onClick={() => step > 1 && setStep(2)}
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
