import { instance } from "../instance";

export const getOrderHistory = async (page = 1, size = 10) => {
  try {
    const response = await instance.get(`orders/history-order`, {
      params: {
        page: page,
        size,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
