const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
        {/* Logo and Social Links */}
        <div className="col-span-2 md:col-span-1">
          <h2 className="text-xl font-bold">SKYN.</h2>
          <p className="mt-4">THEO DÕI CHÚNG TÔI</p>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="text-white hover:text-gray-400">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-white hover:text-gray-400">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-white hover:text-gray-400">
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 className="font-semibold mb-2">Sản Phẩm</h3>
          <ul>
            <li>
              <a href="#" className="hover:underline">
                Chăm Sóc Từ Trong Ra Ngoài
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Chăm Sóc Da
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Chăm Sóc Da Đầu
              </a>
            </li>
          </ul>
        </div>

        {/* Guides */}
        <div>
          <h3 className="font-semibold mb-2">Hướng Dẫn</h3>
          <ul>
            <li>
              <a href="#" className="hover:underline">
                Tin Tức
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Tầm Nhìn
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Hỏi Đáp
              </a>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-semibold mb-2">Dịch Vụ</h3>
          <ul>
            <li>
              <a href="#" className="hover:underline">
                Về Dịch Vụ Chăm Sóc
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Tư Vấn Trực Tuyến
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Cửa Hàng
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-2">Liên Hệ</h3>
          <ul>
            <li>
              <a href="#" className="hover:underline">
                Liên Hệ Với Chúng Tôi
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-xs text-center">
        <p>SKYN. 2019 KINS - Đã đăng ký bản quyền.</p>
        <div className="flex flex-col md:flex-row justify-center mt-2 space-y-2 md:space-y-0 md:space-x-4">
          <a href="#" className="hover:underline">
            Thông Tin Công Ty
          </a>
          <a href="#" className="hover:underline">
            Chính Sách Bảo Mật
          </a>
          <a href="#" className="hover:underline">
            Chính Sách Hủy Đơn
          </a>
          <a href="#" className="hover:underline">
            Điều Khoản Dịch Vụ
          </a>
          <a href="#" className="hover:underline">
            Chính Sách Đổi Trả
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
