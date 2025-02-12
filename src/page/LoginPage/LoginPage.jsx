import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../../assets/img/hero-photo.png";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

const LoginModal = ({ isOpen, onClose }) => {
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Thêm state cho form đăng ký
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Thêm state để hiển thị lỗi
  const [error, setError] = useState("");

  // Tài khoản demo
  const DEMO_ACCOUNT = {
    email: "duy",
    password: "123456",
    fullName: "Demo User",
  };

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowCreateAccount(false);
      setShowForgotPassword(false);
    }
  }, [isOpen]);

  // Handle close with reset
  const handleClose = () => {
    onClose();
    setShowCreateAccount(false);
    setShowForgotPassword(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      formData.email === DEMO_ACCOUNT.email &&
      formData.password === DEMO_ACCOUNT.password
    ) {
      localStorage.setItem("user", JSON.stringify(DEMO_ACCOUNT));
      onClose();
      window.location.reload(); // Reload để cập nhật header
    } else {
      alert("Invalid email or password");
    }
  };

  // Hàm xử lý đăng ký
  const handleRegister = (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu khớp nhau
    if (registerData.password !== registerData.confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    // Xử lý đăng ký ở đây
    setError("");
    // ... logic đăng ký
  };

  if (!isOpen) return null;

  const renderForm = () => {
    if (showCreateAccount) {
      return <RegisterForm onBackToLogin={() => setShowCreateAccount(false)} />;
    }
    if (showForgotPassword) {
      return (
        <ForgotPasswordForm
          onBackToLogin={() => setShowForgotPassword(false)}
        />
      );
    }
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Log in to your account
        </h2>

        <form className="space-y-6">
          <div>
            <input
              type="username"
              placeholder="Enter Username"
              className="w-full p-3 border-b border-gray-300 bg-transparent text-gray-800 focus:outline-none focus:border-gray-900 placeholder-gray-500"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full p-3 border-b border-gray-300 bg-transparent text-gray-800 focus:outline-none focus:border-gray-900 placeholder-gray-500"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Forgotten password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-black text-white text-sm font-semibold rounded-md hover:bg-gray-800 transition"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-4">New to SKYN?</p>
          <button
            onClick={() => setShowCreateAccount(true)}
            className="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Create account
            <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white w-full max-w-5xl rounded-lg shadow-xl flex overflow-hidden">
          {/* Left Side - Image */}
          <div className="hidden lg:block w-1/2 relative">
            <img
              src={img1}
              alt="Beauty Product"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Right Side - Forms */}
          <div className="w-full lg:w-1/2 p-8">
            {/* Close button */}
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
              onClick={handleClose}
            >
              <span className="text-2xl">&times;</span>
            </button>

            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
