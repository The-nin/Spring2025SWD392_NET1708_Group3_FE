import { instance } from "../instance";

export const checkout = async (checkoutData) => {
  try {
    const { addressId, cartId, paymentMethod, voucherCode } = checkoutData;
    const response = await instance.post(
      `/orders/checkout?addressId=${addressId}&cartId=${cartId}&paymentMethod=${paymentMethod}${
        voucherCode ? `&voucherCode=${voucherCode}` : ""
      }`,
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
    const response = await instance.get(
      `/orders/payment-callback${queryString}`
    );

    return {
      code: response.code,
      message: response.message,
      result: {
        orderId: response.result?.orderId,
        orderInfo: response.result?.orderInfo,
      },
    };
  } catch (error) {
    console.error("Payment verification error:", error);
    return {
      code: error.response?.code || 500,
      message:
        error.response?.message || "Có lỗi xảy ra khi xác thực thanh toán",
    };
  }
};

export const confirmPaymentSuccess = async (paymentData) => {
  try {
    const response = await instance.post(
      "/orders/payment-success",
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return {
      error: false,
      code: response.data?.code || 200,
      message: response.data?.message || "Xác nhận thanh toán thành công",
      result: response.data?.result,
      redirectUrl: response.data?.redirectUrl,
    };
  } catch (error) {
    console.error("Payment success confirmation error:", error);
    return {
      error: true,
      code: error.response?.data?.code || 500,
      message:
        error.response?.data?.message ||
        "Có lỗi xảy ra khi xác nhận thanh toán",
    };
  }
};
