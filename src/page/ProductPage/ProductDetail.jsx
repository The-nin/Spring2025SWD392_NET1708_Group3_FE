import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Minus, Plus, Heart, ChevronDown } from "lucide-react";
import { getProductDetail } from "../../service/product";
import { addItemToCart } from "../../service/cart/cart";
import imgProduct from "../../assets/Rectangle 3.png";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(imgProduct);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await getProductDetail(slug);
        if (!response.error) {
          setProduct(response.result);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi tải thông tin sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
  }, [slug]);

  const handleAddToCart = async () => {
    try {
      const response = await addItemToCart(product.id, quantity);
      if (!response.error) {
        toast.success("Thêm vào giỏ hàng thành công!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-lg shadow-sm">
      {/* Image Section */}
      <div className="relative space-y-6">
        <div className="w-full h-[500px] rounded-lg overflow-hidden bg-gray-50 transition-all duration-300">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-gray-500">No Image Available</span>
          )}
        </div>

        {/* Description Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="w-full flex justify-between items-center text-left font-medium p-4 bg-gray-50">
              <span className="text-gray-800">Description</span>
            </div>
            <div className="p-4">
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
          <div className="flex items-center space-x-3">
            <span className="text-red-600 text-3xl font-bold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.price)}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-lg leading-relaxed">
          {product.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 font-medium">Availability:</span>
            {product.stock > 0 ? (
              <div className="flex items-center space-x-2">
                <span className="text-green-600 font-medium">In Stock</span>
                <span className="text-gray-600">({product.stock} items)</span>
              </div>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>
        </div>

        {/* Quantity and Cart */}
        <div className="pt-6 space-y-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md px-4 py-2 bg-gray-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="hover:text-red-500 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="px-6 font-medium">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="hover:text-red-500 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-black hover:bg-gray-700 text-white px-8 py-2 rounded-md flex-1 transition-colors duration-300"
              >
                ADD TO CART
              </button>
              <button className="p-2 border rounded-md hover:border-red-500 hover:text-red-500 transition-all duration-300">
                <Heart size={22} />
              </button>
            </div>
            <button className="bg-black hover:bg-gray-700 text-white px-8 py-3 rounded-md w-full transition-colors duration-300">
              BUY IT NOW
            </button>
          </div>
        </div>

        {/* Delivery & Returns */}
        <div className="pt-6 space-y-3">
          <h3 className="text-xl font-semibold text-gray-800">
            Delivery & Returns
          </h3>
          <p className="text-gray-600 leading-relaxed">
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
