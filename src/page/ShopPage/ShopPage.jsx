import HeroSection from "../../components/HeroSection/HeroSection";
// import { Pagination } from "antd";
import { motion } from "framer-motion";
import ProductCardList from "../../components/ProductCardList/ProductCardList";
import { getAllProduct } from "../../service/product/getAllProduct";
import { useEffect, useState } from "react";

const ShopPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  const fetchAllProduct = async () => {
    const data = await getAllProduct();
    if (data.error) {
      setErrors(data.message);
    } else {
      setProducts(data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllProduct();
    console.log(products);
  }, [products]);

  return (
    <>
      <div>
        {/* Hero Section  */}
        <HeroSection />

        {/* Nav product */}
        <div className="flex gap-8 bg-amber-100 p-5 border-b-2 border-gray-200">
          <a className="text-black hover:underline cursor-pointer">Shop All</a>
          <a className="text-black hover:underline cursor-pointer">Toner</a>
          <a className="text-black hover:underline cursor-pointer">Moister</a>
          <a className="text-black hover:underline cursor-pointer">Serum</a>
        </div>

        {/* Header product */}
        <div className="p-8">
          <p className="pb-3 text-lg">Reverd Formulations</p>
          <h1 className="text-4xl ">Essentials For Every Skincare</h1>
        </div>

        {/* Product List */}
        <div>
          {loading ? (
            <p>Loading products...</p>
          ) : errors ? (
            <p>{errors}</p>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <ProductCardList {...product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p>No products available.</p> // Handle case where products array is empty
          )}
        </div>

        {/* Pagination */}
        {/* <div className="flex justify-center m-10">
          <Pagination align="center" defaultCurrent={1} total={50} />
        </div> */}
      </div>
    </>
  );
};

export default ShopPage;
