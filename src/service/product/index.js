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

export const getLatestProducts = async (limit = 4) => {
  try {
    const response = await instance.get(`/products/latest?limit=${limit}`);
    return response;
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.message || "Có lỗi xảy ra",
    };
  }
};

export const createProductFeedback = async (productId, data) => {
  try {
    const response = await instance.post(
      `/feedbacks/${productId}`,
      {
        description: data.content,
        rating: data.rating,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.message || "Có lỗi xảy ra",
    };
  }
};
