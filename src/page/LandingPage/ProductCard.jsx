import React, { useState } from "react";
import LoginModal from "../LoginPage/LoginPage";
import { addItemToCart } from "../../service/cart/cart";
import { toast } from "react-toastify";

const ProductCard = ({
  id,
  tag,
  name,
  description,
  size,
  price,
  thumbnail,
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Thêm hàm format số
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await addItemToCart(id, 1);
      if (response.error) {
        toast.error(response.message);
      } else {
        toast.success("Added to cart successfully!");
      }
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="group cursor-pointer relative flex flex-col items-center text-center bg-white p-4 hover:shadow-xl transition duration-300 rounded-lg h-[500px] w-[300px]">
        {/* Tag */}
        {tag && (
          <span className="absolute top-2 left-2 text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
            {tag}
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
            <p className="font-semibold text-black">${formatPrice(price)}</p>
          </div>
        </div>

        {/* Button Section */}
        <div className="w-full mt-2">
          <button
            className="w-full bg-black text-white py-2 px-6 rounded-md text-sm opacity-0 group-hover:opacity-100 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add to your Cart"}
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
