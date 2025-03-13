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
      `admin/orders/confirm-order/${orderId}?orderStatus=${status}`,
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

export const changeToDelivery = async (orderId, status) => {
  try {
    const response = await instance.patch(
      `admin/orders/change-to-delivery/${orderId}?orderStatus=${status}`,
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

export const updateDeliveryStatus = async (orderId, status, image) => {
  try {
    const response = await instance.patch(
      `admin/orders/delivery/${orderId}?orderStatus=${status}`,
      {
        image,
      },
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

export const uploadToCloudinary = async (file) => {
  try {
    const CLOUDINARY_UPLOAD_PRESET = "phuocnt-cloudinary";
    const CLOUDINARY_CLOUD_NAME = "dl5dphe0f";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};
