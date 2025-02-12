import React, { useState } from "react";

const RegisterForm = ({ onBackToLogin }) => {
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "", // Giá trị có thể là 'male', 'female', 'other'
  });

  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    setError("");
    // ... logic đăng ký
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Create your account
      </h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <form className="space-y-6" onSubmit={handleRegister}>
        <div>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border-b border-gray-300 bg-transparent text-gray-800 focus:outline-none focus:border-gray-900 placeholder-gray-500"
            required
            value={registerData.fullName}
            onChange={(e) =>
              setRegisterData({ ...registerData, fullName: e.target.value })
            }
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border-b border-gray-300 bg-transparent text-gray-800 focus:outline-none focus:border-gray-900 placeholder-gray-500"
            required
            value={registerData.email}
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-2">
              Ngày sinh
            </label>
            <input
              type="date"
              className="w-full p-3 border-b border-gray-300 bg-transparent text-gray-800 focus:outline-none focus:border-gray-900"
              required
              value={registerData.dateOfBirth}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  dateOfBirth: e.target.value,
                })
              }
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-2">
              Giới tính
            </label>
            <select
              className="w-full p-3 border-b border-gray-300 bg-transparent text-gray-800 focus:outline-none focus:border-gray-900"
              required
              value={registerData.gender}
              onChange={(e) =>
                setRegisterData({ ...registerData, gender: e.target.value })
              }
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>
        <div>
          <input
            type="password"
            placeholder="Create Password"
            className="w-full p-3 border-b border-gray-300 bg-transparent text-gray-800 focus:outline-none focus:border-gray-900 placeholder-gray-500"
            required
            value={registerData.password}
            onChange={(e) =>
              setRegisterData({ ...registerData, password: e.target.value })
            }
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 border-b border-gray-300 bg-transparent text-gray-800 focus:outline-none focus:border-gray-900 placeholder-gray-500"
            required
            value={registerData.confirmPassword}
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                confirmPassword: e.target.value,
              })
            }
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-3 bg-black text-white text-sm font-semibold rounded-md hover:bg-gray-800 transition"
        >
          Create Account
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-4">Already have an account?</p>
        <button
          onClick={onBackToLogin}
          className="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
        >
          Back to login
          <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
