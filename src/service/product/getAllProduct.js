import { instance } from "../instance";

export const getAllProduct = async ({
  categorySlug,
  brandSlug,
  keyword,
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
    if (keyword) {
      params.keyword = keyword;
    }

    const adjustedPage = Math.max(0, page);

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
