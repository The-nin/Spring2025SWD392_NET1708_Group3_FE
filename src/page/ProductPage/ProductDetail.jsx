import { useState } from "react";
import { Minus, Plus, Heart, ChevronDown } from "lucide-react";
import imgProduct from "../../assets/Rectangle 3.png";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(imgProduct);
  const [openSection, setOpenSection] = useState(null);
  const [isHovered, setIsHovered] = useState(null);
  const thumbnailImages = [imgProduct, imgProduct, imgProduct, imgProduct];

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-lg shadow-sm">
      {/* Image Section */}
      <div className="relative space-y-6">
        <div className="w-full h-[500px] rounded-lg overflow-hidden bg-gray-50 transition-all duration-300">
          {mainImage ? (
            <img
              src={mainImage}
              alt="Acne Treatment Mask"
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-gray-500">No Image Available</span>
          )}
        </div>
        <div className="flex justify-start space-x-4 mt-4 overflow-x-auto pb-2">
          {thumbnailImages.map((image, index) => (
            <div
              key={index}
              className={`relative ${
                isHovered === index ? "scale-105" : ""
              } transition-all duration-200`}
              onMouseEnter={() => setIsHovered(index)}
              onMouseLeave={() => setIsHovered(null)}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 h-20 rounded-md cursor-pointer object-cover ${
                  mainImage === image
                    ? "border-2 border-black"
                    : "border border-gray-200 hover:border-gray-400"
                }`}
                onClick={() => setMainImage(image)}
              />
            </div>
          ))}
        </div>

        {/* Overview Section */}
        <div className="mt-8 space-y-3">
          {[
            "Product Overview",
            "How To Use",
            "Add To Glance",
            "Ingredients",
            "Other Details",
          ].map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                className="w-full flex justify-between items-center text-left font-medium p-4 hover:bg-gray-50 transition-all duration-300"
                onClick={() => toggleSection(section)}
              >
                <span className="text-gray-800">{section}</span>
                <ChevronDown
                  size={20}
                  className={`transform transition-all duration-300 ease-in-out text-gray-500
                    ${openSection === section ? "rotate-180" : "rotate-0"}
                  `}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out
                  ${
                    openSection === section
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0"
                  }
                `}
              >
                <div className="p-4 bg-gray-50">
                  <p className="text-gray-600 leading-relaxed">
                    Details about {section}.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Info Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">
            Lorem Ipsum Dolor
          </h1>
          <div className="flex items-center space-x-3">
            <span className="text-gray-400 line-through text-xl">Rs. 275</span>
            <span className="text-red-600 text-3xl font-bold">Rs. 262</span>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
              Save 5%
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-lg leading-relaxed">
          Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.
        </p>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 font-medium">Vendor:</span>
            <span className="text-gray-800">Skin White</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 font-medium">SKU:</span>
            <span className="text-gray-800">8964002548705</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 font-medium">Availability:</span>
            <span className="text-green-600 font-medium">In Stock</span>
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
                  onClick={() => setQuantity(quantity + 1)}
                  className="hover:text-red-500 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <button className="bg-black hover:bg-gray-700 text-white px-8 py-2 rounded-md flex-1 transition-colors duration-300">
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
