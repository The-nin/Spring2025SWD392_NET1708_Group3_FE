/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../../assets/img/hero-photo.png";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { login } from "../../service/login/index"; // Import API login

const LoginModal = ({ isOpen, onClose }) => {
  const [activeForm, setActiveForm] = useState("login");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setActiveForm("login");
      setErrors({ username: "", password: "", general: "" });
      setFormData({ username: "", password: "" });
    }
  }, [isOpen]);

  const handleFormChange = (form) => {
    setErrors({ username: "", password: "", general: "" });
    setActiveForm(form);
  };

  const handleClose = () => {
    onClose();
    setActiveForm("login");
    setErrors({ username: "", password: "", general: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", password: "", general: "" };

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    // Validate password - chỉ kiểm tra khi password chưa đủ 6 ký tự
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length > 0 && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({ username: "", password: "", general: "" });

    if (!validateForm()) {
      return;
    }

    try {
      const response = await login(formData.username, formData.password);
      console.log("API Response:", response);

      if (response?.error || response?.code !== 200) {
        setErrors({ ...errors, general: response.message || "Login failed" });
        return;
      }

      localStorage.setItem("token", response.result.token);
      localStorage.setItem("username", formData.username);
      onClose();
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Login failed:", err);
      setErrors({
        ...errors,
        general: "Login failed. Please check your credentials.",
      });
    }
  };

  if (!isOpen) return null;

  const renderForm = () => {
    if (activeForm === "register")
      return <RegisterForm onBackToLogin={() => handleFormChange("login")} />;
    if (activeForm === "forgotPassword")
      return (
        <ForgotPasswordForm onBackToLogin={() => handleFormChange("login")} />
      );

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Đăng nhập vào tài khoản của bạn
        </h2>
        {errors.general && (
          <p className="text-red-500 text-sm">{errors.general}</p>
        )}
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập"
              className={`w-full p-3 border-b ${
                errors.username ? "border-red-500" : "border-gray-300"
              } bg-transparent focus:outline-none`}
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className={`w-full p-3 border-b ${
                errors.password ? "border-red-500" : "border-gray-300"
              } bg-transparent focus:outline-none`}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <div className="text-right">
            <button
              type="button"
              onClick={() => handleFormChange("forgotPassword")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Quên mật khẩu?
            </button>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 bg-black text-white text-sm font-semibold rounded-md hover:bg-gray-800 transition"
          >
            Đăng nhập
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Bạn chưa có tài khoản SKYN?
          </p>
          <button
            onClick={() => handleFormChange("register")}
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Tạo tài khoản →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white w-full max-w-5xl rounded-lg shadow-xl flex overflow-hidden">
          <div className="hidden lg:block w-1/2 relative">
            <img
              src={img1}
              alt="Beauty Product"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="w-full lg:w-1/2 p-8">
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
