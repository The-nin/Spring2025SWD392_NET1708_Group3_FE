import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaShoppingBag } from "react-icons/fa";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8"
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
              transition={{
                scale: { duration: 0.5 },
                rotate: { duration: 0.5, delay: 0.5 },
              }}
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
            >
              <FaCheckCircle className="text-green-600 text-5xl" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-light text-gray-900 mb-3">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-600 mb-8">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý và sẽ được
            giao trong thời gian sớm nhất.
          </p>

          <Link
            to="/shop"
            className="w-full bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
          >
            <FaShoppingBag className="mr-2" />
            Tiếp tục mua sắm
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
