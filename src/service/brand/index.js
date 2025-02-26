import { instance } from "../instance";

// Public function - no token needed
export const getAllBrands = async (params) => {
  try {
    const response = await instance.get("admin/brands", { params });
    return {
      error: false,
      result: response.result,
      message: response.message,
    };
  } catch (error) {
    console.error("Get brands error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to fetch brands",
    };
  }
};

export const getAllBrandsUser = async (params) => {
  try {
    const response = await instance.get("/brands", { params });
    return {
      error: false,
      result: response.result,
      message: response.message,
    };
  } catch (error) {
    console.error("Get brands error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to fetch brands",
    };
  }
};

// Admin functions - require token
export const getBrandById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get(`admin/brands/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      error: false,
      result: response.result,
      message: response.message,
    };
  } catch (error) {
    console.error("Get brand error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to fetch brand details",
    };
  }
};

export const addBrand = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    // Get the file and form data
    const requestData = JSON.parse(formData.get("request"));
    const file = formData.get("thumbnail");

    // Upload to Cloudinary first
    const imageUrl = await uploadToCloudinary(file);

    // Create the final request data
    const brandData = {
      ...requestData,
      thumbnail: imageUrl,
    };

    const response = await instance.post("admin/brands", brandData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return {
      error: false,
      result: response.result,
      message: response.message,
    };
  } catch (error) {
    console.error("Add brand error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return {
      error: true,
      message: error.response?.data?.message || "Failed to add brand",
    };
  }
};

export const updateBrand = async (id, formData) => {
  try {
    const token = localStorage.getItem("token");

    // Nếu formData là FormData (có file mới)
    if (formData instanceof FormData) {
      const requestData = JSON.parse(formData.get("request"));
      const file = formData.get("thumbnail");

      // Nếu có file mới, upload lên Cloudinary
      let brandData = { ...requestData };
      if (file) {
        const imageUrl = await uploadToCloudinary(file);
        brandData.thumbnail = imageUrl;
      }

      const response = await instance.put(`admin/brands/${id}`, brandData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return {
        error: false,
        result: response.result,
        message: response.message,
      };
    } else {
      // Xử lý trường hợp không có file mới
      const response = await instance.put(`admin/brands/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        error: false,
        result: response.result,
        message: response.message,
      };
    }
  } catch (error) {
    console.error("Update brand error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to update brand",
    };
  }
};

export const deleteBrand = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.delete(`admin/brands/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      error: false,
      result: response.result,
      message: response.message,
    };
  } catch (error) {
    console.error("Delete brand error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to delete brand",
    };
  }
};

// Reuse the Cloudinary upload function
const uploadToCloudinary = async (file) => {
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

export const updateBrandStatus = async (brandId, status) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.patch(
      `admin/brands/change-status/${brandId}?status=${status}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      error: false,
      result: response.result,
      message: response.message,
    };
  } catch (error) {
    console.error("Update product status error:", error);
    return {
      error: true,
      message: error.response?.message || "Failed to update product status",
    };
  }
};
