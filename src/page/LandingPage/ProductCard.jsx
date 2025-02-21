import React from "react";

const ProductCard = ({ tag, name, description, size, price, imgSrc }) => {
  return (
    <div className="group cursor-pointer relative flex flex-col items-center text-center bg-white p-4 hover:shadow-xl transition duration-300 rounded-lg min-h-[480px]">
      {/* Tag */}
      {tag && (
        <span className="absolute top-2 left-2 text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
          {tag}
        </span>
      )}

      {/* Image Section */}
      <div className="h-48 mt-4 flex items-center justify-center">
        <img
          src={imgSrc}
          alt={name}
          className="max-w-full max-h-full object-contain"
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

      {/* Button Section */}
      <div className="w-full mt-2">
        <button
          className="w-full bg-black text-white py-2 px-6 rounded-md text-sm opacity-0 group-hover:opacity-100 transition duration-300"
          onClick={() => alert("Added to cart!")}
        >
          Add to your Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
