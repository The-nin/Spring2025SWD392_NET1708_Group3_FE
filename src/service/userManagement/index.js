import { instance } from "../instance";

export const getUsersAdmin = async (page = 1, pageSize = 10) => {
  try {
    const response = await instance.get("/admin/users", {
      params: {
        page: page - 1,
        size: pageSize,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await instance.delete(`admin/users/${userId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await instance.put(
      `/api/v1/admin/users/${userId}/status`,
      {
        status: status,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
