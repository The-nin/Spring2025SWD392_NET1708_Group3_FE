import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { products } from "./ProductList";
import ProductCard from "./ProductCard.jsx";
import HeroSection from "../../components/HeroSection/HeroSection";
import img1 from "../../assets/img/hero-photo.png";
import heroImg from "../../assets/img/hero-landingPage.png";
import { useEffect, useState } from "react";
import { getLatestProducts } from "../../service/product";

const LandingPage = () => {
  const [latestProducts, setLatestProducts] = useState([]);

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
            <p className="text-sm text-gray-500 uppercase">Skin Care</p>
            <h2 className="text-3xl font-semibold text-gray-800 mt-2">
              Potent Solutions for Demanding Skin
            </h2>
            <p className="text-gray-600 mt-4">
              Discover products tailored for mature skin and urban lifestyles,
              offering daily hydration and the added advantage of powerful
              vitamins and antioxidants.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center text-black hover:opacity-75 transition-opacity"
            >
              <motion.div
                className="border border-black px-8 py-4 flex items-center justify-between min-w-[180px] mt-4"
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-gray-700">Read more</span>
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
        <h1 className="text-3xl font-semibold mb-2">
          Supreme Skin Fortification
        </h1>
        <p className="text-gray-500 mb-6">
          Discover our potent antioxidant-rich Parsley Seed Skin Care, perfect
          for all skin types.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestProducts.map((product, index) => (
            <motion.div
              key={product.id || index}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
        <motion.div className="mt-8" whileHover={{ x: 10 }}>
          <a
            href="/all-products"
            className="text-sm font-medium underline hover:text-black"
          >
            All Products →
          </a>
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
          <p className="text-sm uppercase tracking-wide mb-4">
            Revitalize Your Body
          </p>
          <h1 className="text-4xl font-semibold mb-6">
            Effective Ingredients for Visible Results
          </h1>
          <p className="text-lg mb-8 leading-relaxed">
            Our body products are rich in highly effective ingredients, achieve
            visible results, firm the skin and leave it feeling soft and supple.
            Fine textures that are quickly absorbed, non-greasy and in no way
            inferior to facial care. It's time to give our body the same
            attention as our face.
          </p>
          <motion.button
            className="bg-transparent border border-white text-white py-2 px-6 rounded-md hover:bg-white hover:text-black transition"
            whileHover={{ scale: 1.1 }}
          >
            Discover More
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
            <h1 className="text-3xl font-light mb-6">Our Story</h1>
            <p className="text-gray-600 mb-6">
              Our line features meticulous skin, face and body care
              formulations, crafted with both efficacy and sensory delight in
              focus.
            </p>
            <p className="text-gray-600 mb-8">
              We are dedicated to creating top-quality skin, face and body care
              products. We extensively research plant-based and lab-made
              ingredients to ensure both safety and proven effectiveness. As our
              distinctive stores, knowledgeable consultants are eager to
              introduce you to the lineup range and assist with your choices.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center text-black hover:opacity-75 transition-opacity"
            >
              <div className="border border-black px-8 py-4 flex items-center justify-between min-w-[300px]">
                <span className="text-gray-700">Our approach to products</span>
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
