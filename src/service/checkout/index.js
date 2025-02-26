import { instance } from "../instance";

export const checkout = async (checkoutData) => {
  try {
    const { addressId, cartId, paymentMethod } = checkoutData;
    const response = await instance.post(
      `/orders/checkout?addressId=${addressId}&cartId=${cartId}&paymentMethod=${paymentMethod}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return {
      error: false,
      result: response,
    };
  } catch (error) {
    return {
      error: true,
      message: error.response?.message || "Có lỗi xảy ra khi đặt hàng",
    };
  }
};
