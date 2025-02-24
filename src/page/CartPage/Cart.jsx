import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, removeCart, updateCart } from "../../service/cart/cart";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

function Cart() {
  const [cart, setCart] = useState(null);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await getCart();
      if (response.error) {
        setErrors(response.message);
        toast.error(response.message || "Failed to fetch cart"); // Thông báo lỗi bằng toast
        setCart(null);
      } else {
        setErrors(null);
        setCart(response.result);
      }
    } catch (error) {
      setErrors("Failed to fetch cart");
      toast.error("Failed to fetch cart"); // Thông báo lỗi bất ngờ
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await removeCart({ productId });
      if (response.error) {
        setErrors(response.message || "Failed to delete item");
        toast.error(response.message || "Failed to delete item"); // Thông báo lỗi bằng toast
      } else {
        setErrors(null);
        toast.success(
          response.message || "Item removed from cart successfully"
        );
        await fetchCart();
      }
    } catch (error) {
      setErrors("An unexpected error occurred while deleting the item");
      toast.error("An unexpected error occurred while deleting the item");
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const response = await updateCart({
        productId: productId,
        quantity: newQuantity,
      });
      if (response.error) {
        setErrors(response.message);
        toast.error(response.message || "Failed to update quantity"); // Thông báo lỗi bằng toast
      } else {
        setErrors(null);
        await fetchCart();
      }
    } catch (error) {
      setErrors("Failed to update quantity");
      toast.error("Failed to update quantity");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước đó trong lịch sử điều hướng
  };

  return (
    <>
      {/* Cart Header */}
      <div className="flex justify-center items-center flex-col mt-10 mb-8 relative">
        <h1 className="text-3xl font-bold mb-3">Shopping Cart</h1>
        <h5 className="text-gray-600 text-center">
          Purchase one more item of the sale products and receive <br />
          free shipping!{" "}
          <span className="text-sm italic">
            *Automatically applied on the next page
          </span>
        </h5>
        {/* Nút quay lại ở góc trên bên trái */}
        <button
          onClick={handleGoBack}
          className="absolute top-0 left-24 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors rounded-md px-4 py-2 flex items-center space-x-2 shadow-sm"
          title="Back to Shop"
        >
          <FaArrowLeft size={16} />
          <span>Back to Shop</span>
        </button>
      </div>

      {!cart?.items || cart.items.length === 0 ? (
        <div className="flex justify-center items-center flex-col mt-20">
          <p className="text-xl text-gray-500">
            You don't have any items in your cart
          </p>
        </div>
      ) : (
        <div className="container mx-auto p-5 max-w-7xl">
          <div className="bg-white rounded-lg shadow-md p-6">
            <table className="w-full border-collapse">
              <thead className="border-b-2">
                <tr>
                  <th className="text-left text-lg pb-4">PRODUCT</th>
                  <th className="text-left text-lg pb-4">PRICE</th>
                  <th className="text-left text-lg pb-4 w-[10rem]">QUANTITY</th>
                  <th className="text-left text-lg pb-4">SUB-TOTAL</th>
                  <th className="text-left text-lg pb-4"></th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((product, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.thumbnail}
                          alt="thumbnail"
                          className="w-16 h-16 object-contain rounded-md border p-1"
                        />
                        <div>
                          <h2 className="text-sm font-semibold text-gray-800">
                            {product.productName}
                          </h2>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm font-medium text-gray-700">
                      ${product.price}
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              product.productId,
                              product.quantity - 1
                            )
                          }
                          disabled={product.quantity <= 1}
                          className="border rounded-md p-2 hover:bg-gray-100 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">
                          {product.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              product.productId,
                              product.quantity + 1
                            )
                          }
                          disabled={product.quantity >= 5}
                          className="border rounded-md p-2 hover:bg-gray-100 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-sm font-medium text-gray-700">
                      ${product.totalItemPrice}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(product.productId)}
                        className="text-gray-500 hover:text-red-600 transition-colors p-2"
                        title="Remove item"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Section */}
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-end items-center space-x-8">
                <div className="text-lg font-semibold text-gray-700">Total</div>
                <div className="text-2xl font-bold">${cart.totalPrice}</div>
              </div>
              <p className="text-right text-sm text-gray-500 mt-2">
                Shipping Fee will be calculated at the time of purchase
              </p>

              {/* Checkout Button */}
              <div className="flex justify-end mt-6">
                <Link to="/payment">
                  <button className="bg-black text-white py-3 px-8 rounded-md hover:bg-gray-800 transition-colors w-full md:w-[21rem]">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
