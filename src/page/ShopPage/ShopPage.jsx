import HeroSection from "../../components/HeroSection/HeroSection";
import { Pagination } from "antd";
import { motion } from "framer-motion";
import ProductCardList from "../../components/ProductCardList/ProductCardList";
import { getAllProduct } from "../../service/product/getAllProduct";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SiDeluge } from "react-icons/si";
const ShopPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  //product state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const { slug } = useParams(); // ✅ Lấy đúng giá trị của slug

  //pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);

  const fetchProduct = async () => {
    const data = await getAllProduct({ slug });
    if (data.error) {
      setErrors(data.message);
    } else {
      setProducts(data.result.productResponses);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log(slug);
    fetchProduct();
  }, [slug]);

  const indexOfLastProduct = currentPage * pageSize;
  const indexOfFirstProduct = indexOfLastProduct - pageSize;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

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
            <p className="flex justify-center alignitems-center ">
              Loading products...
            </p>
          ) : errors ? (
            <p className="flex justify-center">{errors}</p>
          ) : currentProducts?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentProducts.map((product, index) => (
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
            <p className="flex justify-center">No products available.</p> // Handle case where products array is empty
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center m-10">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={products.length}
            onChange={onPageChange}
            showSizeChanger={false} // Disable changing the page size
          />
        </div>
      </div>
    </>
  );
};

export default ShopPage;
