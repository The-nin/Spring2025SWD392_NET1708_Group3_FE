import { instance } from "../instance";

// Public function - no token needed
export const getAllProducts = async (params) => {
  try {
    const response = await instance.get("/products", { params });
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
    const response = await instance.get(`/products/${id}`, {
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

export const addProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.post(
      "/products",
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
      `/products/${id}`,
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
      result: response.data.result,
      message: response.data.message,
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
    const response = await instance.delete("/products", {
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
