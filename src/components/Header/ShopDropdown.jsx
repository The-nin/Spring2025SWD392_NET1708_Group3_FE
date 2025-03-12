import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCategoriesUser } from "../../service/category/index";
import { getAllBrandsUser } from "../../service/brand/index";

const ShopDropdown = ({ isOpen, onClose, shopButtonRef }) => {
  const dropdownRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategoriesUser();
      console.log(response);
      if (response) {
        setCategories(response.result.categoryResponses);
      } else {
        console.error("Failed to fetch categories:", response.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await getAllBrandsUser();
      if (response && !response.error) {
        setBrands(response.result.brandResponses);
      } else {
        console.error("Failed to fetch brands:", response.message);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  // Xử lý click ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        shopButtonRef.current &&
        !shopButtonRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, shopButtonRef]);

  // Hàm xử lý click vào link
  const handleLinkClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 w-[90vw] bg-white shadow-lg border-t border-gray-200 py-8 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 gap-8">
          {/* Category Column */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Danh mục</h3>
            <ul className="space-y-3">
              {/* Shop All là mục tĩnh */}
              <li>
                <Link
                  to="/shop"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Tất cả
                </Link>
              </li>
              {/* Các categories từ API */}
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/shop/category/${category.slug}`}
                    onClick={handleLinkClick}
                    className="text-gray-600 hover:text-black"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand Column */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Thương hiệu</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/shop"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Tất cả
                </Link>
              </li>
              {brands.map((brand) => (
                <li key={brand.id}>
                  <Link
                    to={`/shop/brand/${brand.slug}`}
                    onClick={handleLinkClick}
                    className="text-gray-600 hover:text-black"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDropdown;
