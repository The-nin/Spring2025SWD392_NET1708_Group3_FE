import { instance } from "../instance";

export const getAllProduct = async ({
  categorySlug,
  brandSlug,
  page = 1,
  size = 10,
} = {}) => {
  try {
    const params = {};
    if (categorySlug) {
      params.categorySlug = categorySlug;
    }
    if (brandSlug) {
      params.brandSlug = brandSlug;
    }

    const adjustedPage = Math.max(0, page - 1);

    const res = await instance.get(
      `/products?page=${adjustedPage}&size=${size}`,
      { params }
    );
    return res;
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: error.response?.data?.message || "Can't get all products",
    };
  }
};
