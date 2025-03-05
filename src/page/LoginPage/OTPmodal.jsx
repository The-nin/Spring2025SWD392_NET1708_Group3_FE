import React, { useState } from "react";

const OTPModal = ({ isOpen, onClose, onVerify }) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(otp);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center text-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-120">
        <h1 className="text-xl font-semibold mb-4">Xác thực Email</h1>
        <p className="text-gray-600 mb-4 text-lg">
          Vui lòng kiểm tra email của bạn và nhập mã OTP để hoàn tất đăng ký.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md mb-4"
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPModal;
