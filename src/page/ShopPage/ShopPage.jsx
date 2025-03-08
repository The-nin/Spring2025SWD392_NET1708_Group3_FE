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
  const { slug, type } = useParams(); // Thêm type vào params

  //pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalItems, setTotalItems] = useState(0);

  //search state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  // Thêm state để lưu trữ categories
  const [categories, setCategories] = useState([]);

  // Thêm debounce effect để tránh gọi API quá nhiều
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // Hàm để lấy unique categories từ products
  const extractUniqueCategories = (products) => {
    const uniqueCategories = new Map();
    products.forEach((product) => {
      if (product.category) {
        uniqueCategories.set(product.category.id, product.category);
      }
    });
    return Array.from(uniqueCategories.values());
  };

  const fetchProduct = async () => {
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        keyword: debouncedKeyword,
      };

      if (slug) {
        if (window.location.pathname.includes("/shop/brand/")) {
          params.brandSlug = slug;
        } else if (window.location.pathname.includes("/shop/category/")) {
          params.categorySlug = slug;
        }
      }

      // Log để debug
      console.log("API Params:", params);

      const data = await getAllProduct(params);
      if (data.error) {
        setErrors(data.message);
      } else {
        setProducts(data.result.productResponses);
        setTotalItems(data.result.totalElements);
        // Cập nhật categories
        const uniqueCategories = extractUniqueCategories(
          data.result.productResponses
        );
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrors("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(slug);
    fetchProduct();
  }, [slug, currentPage, pageSize, debouncedKeyword]); // Thêm debouncedKeyword vào dependencies

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  // Sửa lại hàm onShowSizeChange
  const onShowSizeChange = (current, size) => {
    console.log("Size changed to:", size); // Debug log
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <>
      <div>
        {/* Hero Section  */}
        <HeroSection />

        {/* Combined Search and Nav Section */}
        <div className="bg-white p-5">
          <div className="container mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Categories Navigation */}
              <div className="flex flex-wrap items-center gap-6 cursor-pointer">
                <a
                  className={`text-gray-700 hover:text-gray-600 transition-colors duration-200 ${
                    !slug ? "font-bold text-gray-600" : ""
                  }`}
                  onClick={() => {
                    window.location.href = "/shop";
                  }}
                >
                  Shop All
                </a>
                {categories.map((category) => (
                  <a
                    key={category.id}
                    className={`text-gray-700 hover:text-gray-600 transition-colors duration-200 ${
                      slug === category.slug ? "font-bold text-gray-600" : ""
                    }`}
                    onClick={() => {
                      window.location.href = `/shop/category/${category.slug}`;
                    }}
                  >
                    {category.name}
                  </a>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header product */}
        <div className="p-8">
          <p className="pb-3 text-lg">Reverd Formulations</p>
          <h1 className="text-4xl ">Essentials For Every Skincare</h1>
        </div>

        {/* Thêm UI chọn số lượng sản phẩm trên trang */}
        <div className="flex items-center justify-end px-8 gap-2">
          <span>Show:</span>
          <select
            value={pageSize}
            onChange={(e) =>
              onShowSizeChange(currentPage, parseInt(e.target.value))
            }
            className="border rounded-md p-1"
          >
            <option value="4">4</option>
            <option value="8">8</option>
            <option value="12">12</option>
            <option value="16">16</option>
          </select>
          <span>items per page</span>
        </div>

        {/* Product List */}
        <div>
          {loading ? (
            <p className="flex justify-center alignitems-center">
              Loading products...
            </p>
          ) : errors ? (
            <p className="flex justify-center">{errors}</p>
          ) : products?.length > 0 ? (
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
            <p className="flex justify-center">No products available.</p>
          )}
        </div>

        {/* Update Pagination component */}
        <div className="flex justify-center m-10">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={onPageChange}
            showSizeChanger={false}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
          />
        </div>
      </div>
    </>
  );
};

export default ShopPage;
