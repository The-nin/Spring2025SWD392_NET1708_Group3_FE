import { instance } from "../instance";

export const changePassword = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.post("/auth/change-password", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
