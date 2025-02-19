import { instance } from "../instance";

// Public function - no token needed
export const getAllCategories = async (params) => {
  try {
    const response = await instance.get("/categories", { params });
    return {
      error: false,
      result: response.result,
      message: response.message,
    };
  } catch (error) {
    console.error("Get categories error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to fetch categories",
    };
  }
};

// Admin functions - require token
export const getCategoryById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get(`/categories/${id}`, {
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
    console.error("Get category error:", error);
    return {
      error: true,
      message:
        error.response?.data?.message || "Failed to fetch category details",
    };
  }
};

export const addCategory = async (categoryData) => {
  try {
    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzd2QzOTIuY29tIiwic3ViIjoiYWRtaW4iLCJleHAiOjE3Mzk2ODIwMjMsImlhdCI6MTczOTY3ODQyMywianRpIjoiZTAzMGRhYmItYzY2OC00MDA4LTg1MjYtYjk2ZjVlNzZjOWU1Iiwic2NvcGUiOiJST0xFX0FETUlOIn0.sT9R03Dciq8-VLfn2AKpED26G63iXbLceUuX6v4bX9ItQ775gPtVGuHJ-TIZdDlhRgAhnTY5sPo8DUeXnZw_Tg";
    const response = await instance.post(
      "admin/categories",
      {
        name: categoryData.name,
        description: categoryData.description,
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
    console.error("Add category error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to add category",
    };
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.put(
      `/categories/${id}`,
      {
        name: categoryData.name,
        description: categoryData.description,
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
    console.error("Update category error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to update category",
    };
  }
};

export const deleteCategory = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.delete(`/categories/${id}`, {
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
    console.error("Delete category error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to delete category",
    };
  }
};
