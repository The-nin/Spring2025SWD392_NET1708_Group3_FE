import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard.jsx";
import HeroSection from "../../components/HeroSection/HeroSection";
import img1 from "../../assets/img/hero-photo.png";
import heroImg from "../../assets/img/hero-landingPage.png";
import { useEffect, useState } from "react";
import { getLatestProducts } from "../../service/product";

const LandingPage = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchLatestProducts();
  }, []);

  const fetchLatestProducts = async () => {
    const response = await getLatestProducts(4);
    if (!response.error) {
      setLatestProducts(response.result || []);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const slideIn = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { duration: 1 } },
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Product's Content */}
      <motion.div
        className="flex items-center justify-center p-10"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-8xl">
          <div className="flex items-center justify-center">
            <motion.img
              src="https://media.cnn.com/api/v1/images/stellar/prod/210803094851-best-skincare-products-over-40-dr-loretta.jpg?q=w_1600,h_902,x_0,y_0,c_fill"
              alt="Skincare product"
              className="rounded-md"
              whileHover={{ scale: 1.05 }}
            />
          </div>

          <motion.div
            className="flex flex-col justify-center"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <p className="text-sm text-gray-500 uppercase">Chăm Sóc Da</p>
            <h2 className="text-3xl font-semibold text-gray-800 mt-2">
              Giải Pháp Hiệu Quả Cho Làn Da Khó Tính
            </h2>
            <p className="text-gray-600 mt-4">
              Khám phá các sản phẩm được thiết kế cho làn da trưởng thành và lối
              sống đô thị, cung cấp độ ẩm hàng ngày cùng với lợi ích từ vitamin
              và chất chống oxy hóa mạnh mẽ.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center text-black hover:opacity-75 transition-opacity"
            >
              <motion.div
                className="border border-black px-8 py-4 flex items-center justify-between min-w-[180px] mt-4"
                whileHover={{ scale: 1.1 }}
              >
                <Link to="/shop">
                  <span className="text-gray-700">Xem thêm</span>
                </Link>
                <FaArrowRight className="ml-4" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* List Product */}
      <motion.div
        className="max-w-7xl mx-auto p-8"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl font-semibold mb-2">Bảo Vệ Da Tối Ưu</h1>
        <p className="text-gray-500 mb-6">
          Khám phá dòng sản phẩm Chăm sóc da Parsley Seed giàu chất chống oxy
          hóa của chúng tôi, phù hợp với mọi loại da.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestProducts.map((product, index) => (
            <motion.div
              key={product._id || index}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <ProductCard
                id={product._id}
                name={product.name}
                description={product.description}
                price={product.price}
                thumbnail={product.thumbnail}
                tag={product.tag}
                size={product.size}
              />
            </motion.div>
          ))}
        </div>
        <motion.div className="mt-8" whileHover={{ x: 10 }}>
          <Link
            to="/shop"
            className="text-sm font-medium underline hover:text-black"
          >
            Tất cả sản phẩm →
          </Link>
        </motion.div>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        className="relative min-h-[420px] max-h-[480px] w-full"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImg})`,
          }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Content */}
        <div className="relative flex flex-col items-start pt-12 max-w-4xl ml-12 mt-4 px-6 text-white">
          <p className="text-sm uppercase tracking-wide mb-4">Làm Mới Cơ Thể</p>
          <h1 className="text-4xl font-semibold mb-6">
            Thành Phần Hiệu Quả Cho Kết Quả Rõ Rệt
          </h1>
          <p className="text-lg mb-8 leading-relaxed">
            Các sản phẩm chăm sóc cơ thể của chúng tôi giàu thành phần hiệu quả
            cao, mang lại kết quả có thể nhìn thấy, làm săn chắc da và để lại
            cảm giác mềm mại, mịn màng. Kết cấu mỏng nhẹ thấm nhanh, không nhờn
            rít và không hề thua kém các sản phẩm chăm sóc da mặt. Đã đến lúc
            quan tâm đến cơ thể như cách chúng ta chăm sóc gương mặt.
          </p>
          <motion.button
            className="bg-transparent border border-white text-white py-2 px-6 rounded-md hover:bg-white hover:text-black transition"
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate("/blog")}
          >
            Tìm Hiểu Thêm
          </motion.button>
        </div>
      </motion.div>

      {/* About Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-2 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={slideIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h1 className="text-3xl font-light mb-6">
              Câu Chuyện Của Chúng Tôi
            </h1>
            <p className="text-gray-600 mb-6">
              Dòng sản phẩm của chúng tôi bao gồm các công thức chăm sóc da, mặt
              và cơ thể tỉ mỉ, được tạo ra với trọng tâm là hiệu quả và trải
              nghiệm cảm giác thư giãn.
            </p>
            <p className="text-gray-600 mb-8">
              Chúng tôi tận tâm tạo ra các sản phẩm chăm sóc da, mặt và cơ thể
              chất lượng cao. Chúng tôi nghiên cứu kỹ lưỡng các thành phần từ
              thực vật và phòng thí nghiệm để đảm bảo cả độ an toàn và hiệu quả
              đã được chứng minh. Tại các cửa hàng đặc trưng của chúng tôi, các
              chuyên viên tư vấn am hiểu luôn sẵn sàng giới thiệu về dòng sản
              phẩm và hỗ trợ bạn trong việc lựa chọn.
            </p>
            <Link
              to="/about-us"
              className="inline-flex items-center text-black hover:opacity-75 transition-opacity"
            >
              <div className="border border-black px-8 py-4 flex items-center justify-between min-w-[300px]">
                <span className="text-gray-700">
                  Cách tiếp cận sản phẩm của chúng tôi
                </span>
                <FaArrowRight className="ml-4" />
              </div>
            </Link>
          </motion.div>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <img
              src={img1}
              alt="Skincare Application"
              className="w-full h-[500px] object-cover"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
