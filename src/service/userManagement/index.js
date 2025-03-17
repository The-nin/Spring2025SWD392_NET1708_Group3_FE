import { instance } from "../instance";

export const getUsersAdmin = async (page = 1, pageSize = 10) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get("/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    const token = localStorage.getItem("token");
    const response = await instance.delete(`admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.patch(
      `/admin/users/change-status/${userId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          status: status,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.post("/admin/users", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const editUser = async (userId, userData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.put(`/admin/users/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get(`/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
