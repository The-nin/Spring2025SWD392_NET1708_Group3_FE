/* eslint-disable react/prop-types */

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic quên mật khẩu
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Đặt lại mật khẩu</h2>
      <p className="text-sm text-gray-600">
        Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để
        đặt lại mật khẩu.
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Địa chỉ Email"
            className="w-full p-3 border-b border-gray-300 bg-transparent text-gray-800 focus:outline-none focus:border-gray-900 placeholder-gray-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-3 bg-black text-white text-sm font-semibold rounded-md hover:bg-gray-800 transition"
        >
          Gửi liên kết đặt lại
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-4">Bạn đã nhớ mật khẩu?</p>
        <button
          onClick={onBackToLogin}
          className="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
        >
          Quay lại đăng nhập
          <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
