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

export const getOrderAdmin = async (params = {}) => {
  try {
    const response = await instance.get(`admin/orders`, {
      params: {
        page: params.page || 0,
        size: params.size || 10,
        keyword: params.keyword,
        sortBy: params.sortBy,
        order: params.order,
        status: params.status,
        paymentStatus: params.paymentStatus,
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

export const deleteOrder = async (orderId) => {
  try {
    const response = await instance.delete(`orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await instance.patch(
      `admin/orders/change-status/${orderId}?orderStatus=${status}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getOrderDetail = async (orderId) => {
  try {
    const response = await instance.get(`admin/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
