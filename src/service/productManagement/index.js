import { instance } from "../instance";

// Public function - no token needed
export const getAllProducts = async (params) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get("admin/products", {
      params,
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
    console.error("Get products error:", error);
    return {
      error: true,
      message: error.response?.message || "Failed to fetch products",
    };
  }
};

// Admin functions - require token
export const getProductById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get(`admin/products/${id}`, {
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
    console.error("Get product error:", error);
    return {
      error: true,
      message: error.response?.message || "Failed to fetch product details",
    };
  }
};

export const addProduct = async (productData, file) => {
  try {
    const token = localStorage.getItem("token");

    // Upload image first
    const imageUrl = await uploadToCloudinary(file);

    // Add image URL to product data
    const finalProductData = {
      ...productData,
      thumbnail: imageUrl,
    };

    const response = await instance.post("admin/products", finalProductData, {
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
    console.error("Add product error:", error.response?.data || error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to add product",
    };
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const token = localStorage.getItem("token");
    const requestData = JSON.parse(formData.get("request"));
    const file = formData.get("thumbnail");

    // Chuẩn bị dữ liệu theo đúng format yêu cầu
    let productData = {
      name: requestData.name.trim(),
      price: requestData.price,
      description: requestData.description.replace(/<p><br><\/p>/g, "").trim(),
      ingredient: requestData.ingredient.replace(/<p><br><\/p>/g, "").trim(),
      usageInstruction: requestData.usageInstruction
        .replace(/<p><br><\/p>/g, "")
        .trim(),
      specification: requestData.specification,
      brand_id: requestData.brand_id,
      category_id: requestData.category_id,
      status: requestData.status,
    };

    // Nếu có file mới, upload lên Cloudinary
    if (file) {
      const imageUrl = await uploadToCloudinary(file);
      productData.thumbnail = imageUrl;
    }

    const response = await instance.put(`admin/products/${id}`, productData, {
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
    console.error("Update product error:", error);
    return {
      error: true,
      message: error.response?.message || "Failed to update product",
    };
  }
};

export const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.delete(`admin/products/${id}`, {
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
    console.error("Delete product error:", error);
    return {
      error: true,
      message: error.response?.message || "Failed to delete product",
    };
  }
};

export const deleteMultipleProducts = async (ids) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.delete("admin/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { ids },
    });
    return {
      error: false,
      result: response.data.result,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Delete products error:", error);
    return {
      error: true,
      message: error.response?.message || "Failed to delete products",
    };
  }
};

export const updateProductStatus = async (productId, status) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.patch(
      `admin/products/change-status/${productId}?status=${status}`,
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

// Add this function after getAllProducts
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

export const addNewBatch = async (productId, batchData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.post(
      `admin/products/import-batch/${productId}`,
      batchData,
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
    console.error("Add batch error:", error);
    return {
      error: true,
      message: error.response?.message || "Failed to add batch",
    };
  }
};

export const getBatches = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get(`admin/products/${productId}/batches`, {
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
    console.error("Get batches error:", error);
    return {
      error: true,
      message: error.response?.message || "Failed to fetch batches",
    };
  }
};

export const deleteBatch = async (batchId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.delete(
      `admin/products/delete-batch/${batchId}`,
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
    console.error("Delete batch error:", error);
    return {
      error: true,
      message: error.response?.message || "Failed to delete batch",
    };
  }
};
