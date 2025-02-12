import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const ShopDropdown = ({ isOpen, onClose, shopButtonRef }) => {
  const dropdownRef = useRef(null);

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

  // Tạo hàm xử lý click vào link
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
            <h3 className="font-medium text-gray-900 mb-4">Category</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/shop"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/cleanse"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Cleanse
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/exfoliate"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Exfoliate
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/treat-masque"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Treat & Masque
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/tone"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Tone
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/hydrate"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Hydrate
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/eyes-lips"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Eyes & Lips
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/sun-care"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Sun Care
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/shave"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Shave
                </Link>
              </li>
            </ul>
          </div>

          {/* Skin Type Column */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Skin Type</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/shop/normal"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Normal
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/dry"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Dry
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/oily"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Oily
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/combination"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Combination
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/sensitive"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Sensitive
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/mature"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Mature
                </Link>
              </li>
            </ul>
          </div>

          {/* Body Column */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Body</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/shop/body"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/body-cream"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Body Cream, oils, scrubs
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/shower"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Shower-gel, shampoo, soap
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/balms"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Balms
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/hands-feet"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Hands & Feet
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/sun-protection"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Sun Protection
                </Link>
              </li>
            </ul>
          </div>

          {/* Fragrances Column */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Fragrances</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/shop/fragrances"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/sauna"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Sauna
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/essential-oils"
                  onClick={handleLinkClick}
                  className="text-gray-600 hover:text-black"
                >
                  Essential Oils
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDropdown;
