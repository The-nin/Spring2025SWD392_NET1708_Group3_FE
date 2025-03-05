import { instance } from "../instance";

export const getBatches = async (params) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get(`admin/batchs`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const addNewBatch = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.post(`admin/batchs`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
