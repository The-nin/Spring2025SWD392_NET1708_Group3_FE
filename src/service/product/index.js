import { instance } from "../instance";

export const getProductDetail = async (slug) => {
  try {
    const response = await instance.get(`/products/${slug}`);
    return response;
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.message || "Có lỗi xảy ra",
    };
  }
};
