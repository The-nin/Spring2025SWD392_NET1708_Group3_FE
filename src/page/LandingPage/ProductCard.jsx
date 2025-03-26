import React, { useState } from "react";
import LoginModal from "../LoginPage/LoginPage";
import { addItemToCart } from "../../service/cart/cart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  id,
  tag,
  name,
  description,
  size,
  price,
  thumbnail,
  slug,
  stock,
}) => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Thêm hàm format số
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleCardClick = () => {
    navigate(`/product/${slug}`);
  };

  const handleAddToCart = async (e) => {
    // Stop propagation to prevent navigation when clicking the button
    e.stopPropagation();

    // Check if product is out of stock
    if (stock === 0) {
      toast.error("Sản phẩm tạm hết hàng");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    // Additional check to ensure stock is greater than 0 before making API call
    if (stock > 0) {
      setIsLoading(true);
      try {
        const response = await addItemToCart(id, 1);
        if (response.error) {
          toast.error(response.message);
        } else {
          toast.success(response.message);
        }
      } catch (error) {
        toast.error("Không thể thêm sản phẩm vào giỏ hàng");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Sản phẩm tạm hết hàng");
    }
  };

  return (
    <>
      <div
        className="group cursor-pointer relative flex flex-col items-center text-center bg-white p-4 hover:shadow-xl transition duration-300 rounded-lg h-[500px] w-[300px]"
        onClick={handleCardClick}
      >
        {/* Tag */}
        {tag && (
          <span className="absolute top-2 left-2 text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
            {tag}
          </span>
        )}

        {/* Out of stock badge */}
        {stock === 0 && (
          <span className="absolute top-2 right-2 text-xs font-semibold bg-red-100 text-red-500 px-2 py-1 rounded-full">
            Hết hàng
          </span>
        )}

        {/* Image Section */}
        <div className="w-[200px] h-[200px] mt-4 flex items-center justify-center">
          <img
            src={thumbnail}
            alt={name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Text Section */}
        <div className="flex flex-col items-center mt-4 space-y-2 flex-1 w-full">
          {/* Name */}
          <div className="h-[40px] w-full flex items-center justify-center">
            <h3 className="font-semibold text-lg line-clamp-1 px-2">{name}</h3>
          </div>

          <div className="h-[32px] w-full flex items-center justify-center">
            <p className="text-sm text-gray-700">{size}</p>
          </div>

          {/* Price */}
          <div className="h-[40px] w-full flex items-center justify-center">
            <p className="font-semibold text-black">{formatPrice(price)}đ</p>
          </div>
        </div>

        {/* Button Section */}
        <div className="w-full mt-2">
          <button
            className="w-full bg-black text-white py-2 px-6 rounded-md text-sm opacity-0 group-hover:opacity-100 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
            disabled={isLoading || stock === 0}
          >
            {isLoading
              ? "Đang thêm..."
              : stock === 0
              ? "Hết hàng"
              : "Thêm vào giỏ hàng"}
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default ProductCard;
