import { GoHeart } from "react-icons/go";
import { addItemToCart } from "../../service/cart/cart";
import { toast } from "react-toastify"; // Import toast từ react-toastify
import { useNavigate } from "react-router-dom"; // Thêm import useNavigate
import { useState } from "react"; // Thêm import useState

function ProductCardList({
  id,
  slug,
  name,
  description,
  size,
  price,
  thumbnail,
}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Please login to add items to cart");
      navigate(-1);
      return;
    }

    setIsLoading(true); // Bắt đầu loading
    try {
      const response = await addItemToCart(id);
      console.log("Add to cart response:", response); // Debug log
      if (response.error) {
        toast.error(response.message || "Failed to add item to cart");
      } else {
        toast.success(response.message || "Item added to cart successfully");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${slug}`); // Điều hướng đến trang chi tiết sản phẩm bằng slug
  };

  return (
    <div className="group cursor-pointer relative flex flex-col items-center text-center bg-white p-4 hover:shadow-xl transition duration-300 rounded-lg min-h-[480px]">
      {/* Image Section */}
      <div onClick={handleCardClick}>
        <div className="h-48 mt-4 flex items-center justify-center relative">
          <img
            src={thumbnail}
            alt={name}
            className="max-w-full max-h-full object-contain"
          />
          <GoHeart
            className="absolute -bottom-0 right-3 cursor-pointer"
            onClick={() => alert("da tim")}
          />
        </div>

        {/* Text Section */}
        <div className="flex flex-col items-center mt-4 space-y-2 flex-1 w-full">
          {/* Name */}
          <div className="h-10 flex items-center justify-center">
            <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
          </div>

          {/* Description */}
          <div className="h-12 flex items-center justify-center">
            <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
          </div>

          {/* Size */}
          <div className="h-8 flex items-center justify-center">
            <p className="text-sm text-gray-700">{size}</p>
          </div>

          {/* Price */}
          <div className="h-10 flex items-center justify-center">
            <p className="font-semibold text-black">${price}</p>
          </div>
        </div>
      </div>

      {/* Button Section */}
      <div className="w-full mt-2">
        <button
          className={`w-full bg-black text-white py-2 px-6 rounded-md text-sm ${
            isLoading ? "opacity-50 cursor-not-allowed" : "opacity-100"
          } transition duration-300`}
          onClick={handleAddToCart} // Gọi hàm handleAddToCart
          disabled={isLoading} // Vô hiệu hóa nút khi đang loading
        >
          {isLoading ? "Loading..." : "Add to your Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCardList;
