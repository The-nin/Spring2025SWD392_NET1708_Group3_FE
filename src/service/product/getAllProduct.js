import { instance } from "../instance";

export const getAllProduct = async ({ slug } = {}) => {
  try {
    const params = {};

    if (slug) {
      params.categorySlug = slug; // Đúng định dạng mong muốn
    }

    const res = await instance.get("/products", { params });
    return res;
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: error.response?.data?.message || "Can't get all products",
    };
  }
};
