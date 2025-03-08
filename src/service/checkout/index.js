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

export const verifyVNPayPayment = async (queryString) => {
  try {
    // Chuyển đổi query string thành object params
    const queryParams = new URLSearchParams(queryString);
    const params = Object.fromEntries(queryParams.entries());

    // Tạo URL với params
    const queryParameters = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParameters.append(key, value);
    });

    const response = await instance.get(
      `/orders/payment-callback?${queryParameters}`
    );
    return response.data;
  } catch (error) {
    return {
      error: true,
      message:
        error.response?.message || "Có lỗi xảy ra khi xác thực thanh toán",
    };
  }
};
