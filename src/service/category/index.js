import { instance } from "../instance";

// Public function - no token needed
export const getAllCategories = async (params) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get("admin/categories", {
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
    console.error("Get categories error:", error);
    return {
      error: true,
      message: error.response?.message || "Failed to fetch categories",
    };
  }
};

export const getAllCategoriesUser = async (params) => {
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
      message: error.response?.message || "Failed to fetch categories",
    };
  }
};

// Admin functions - require token
export const getCategoryById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get(`admin/categories/${id}`, {
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

// Add this new function
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

export const addCategory = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const requestData = JSON.parse(formData.get("request"));
    const file = formData.get("thumbnail");

    // Upload to Cloudinary first
    const imageUrl = await uploadToCloudinary(file);

    // Clean description content
    const cleanDescription = requestData.description
      .replace(/<p><br><\/p>/g, "")
      .trim();

    const categoryData = {
      name: requestData.name.trim(),
      description: cleanDescription,
      thumbnail: imageUrl,
      status: 1,
    };

    const response = await instance.post("admin/categories", categoryData, {
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
    console.error("Add category error:", {
      message: error.message,
      response: error.response,
    });
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
      `admin/categories/${id}`,
      {
        name: categoryData.name,
        description: categoryData.description
          .trim()
          .replace(/[\u200B-\u200D\uFEFF]/g, ""),
        status: categoryData.status,
        thumbnail: categoryData.thumbnail,
      },
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
    const response = await instance.delete(`admin/categories/${id}`, {
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
    console.error("Delete category error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to delete category",
    };
  }
};

// export const updateCategoryStatus = async (categoryId, status) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await instance.patch(
//       `admin/categories/change-status/${categoryId}?status=${status}`,
//       { status },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return {
//       error: false,
//       result: response.result,
//       message: response.message,
//     };
//   } catch (error) {
//     console.error("Update category status error:", error);
//     return {
//       error: true,
//       message: error.response?.message || "Failed to update category status",
//     };
//   }
// };
