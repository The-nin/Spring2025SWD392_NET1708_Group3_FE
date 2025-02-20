import { instance } from "../instance";

// Public function - no token needed
export const getAllProducts = async (params) => {
  try {
    const response = await instance.get("admin/products", { params });
    return {
      error: false,
      result: response.result,
      message: response.message,
    };
  } catch (error) {
    console.error("Get products error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to fetch products",
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
      result: response.data.result,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Get product error:", error);
    return {
      error: true,
      message:
        error.response?.data?.message || "Failed to fetch product details",
    };
  }
};

export const addProduct = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    // Get the file and form data
    const requestData = JSON.parse(formData.get("request"));
    const file = formData.get("thumbnail");

    // Upload to Cloudinary first
    const imageUrl = await uploadToCloudinary(file);

    // Create the final request data
    const productData = {
      ...requestData,
      thumbnail: imageUrl,
    };

    const response = await instance.post("admin/products", productData, {
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
    console.error("Add product error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to add product",
    };
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.put(
      `admin/products/${id}`,
      {
        name: productData.name,
        price: productData.price,
        description: productData.description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      error: false,
      result: response.data.result,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Update product error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to update product",
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
      message: error.response?.data?.message || "Failed to delete product",
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
      message: error.response?.data?.message || "Failed to delete products",
    };
  }
};

// Add this function after getAllProducts
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
