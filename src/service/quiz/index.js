import { instance } from "../instance";

// Public function - no token needed
export const getAllQuizs = async (params) => {
  try {
    const response = await instance.get("admin/quizs", { params });
    return {
      error: false,
      result: response.result,
      message: response.message,
    };
  } catch (error) {
    console.error("Get quizs error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to fetch quiz",
    };
  }
};

// Admin functions - require token
export const getQuizById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.get(`admin/quizs/${id}`, {
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
    console.error("Get quiz error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to fetch quiz details",
    };
  }
};

export const addQuiz = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    // Get the file and form data
    const requestData = JSON.parse(formData.get("request"));
    const file = formData.get("thumbnail");

    // Upload to Cloudinary first
    const imageUrl = await uploadToCloudinary(file);

    // Create the final request data
    const quizData = {
      ...requestData,
      thumbnail: imageUrl,
    };

    const response = await instance.post("admin/quizs", quizData, {
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
    console.error("Add quiz error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return {
      error: true,
      message: error.response?.data?.message || "Failed to add quiz",
    };
  }
};

export const updateQuiz = async (id, formData) => {
  try {
    const token = localStorage.getItem("token");

    // Nếu formData là FormData (có file mới)
    if (formData instanceof FormData) {
      const requestData = JSON.parse(formData.get("request"));
      const file = formData.get("thumbnail");

      // Nếu có file mới, upload lên Cloudinary
      let quizData = { ...requestData };
      if (file) {
        const imageUrl = await uploadToCloudinary(file);
        quizData.thumbnail = imageUrl;
      }

      const response = await instance.put(`admin/quizs/${id}`, quizData, {
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
      const response = await instance.put(`admin/quizs/${id}`, formData, {
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
    console.error("Update quiz error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to update quiz",
    };
  }
};

export const deleteQuiz = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.delete(`admin/quizs/${id}`, {
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
    console.error("Delete quiz error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to delete quiz",
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

export const updateQuizStatus = async (quizId, status) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.patch(
      `admin/quizs/change-status/${quizId}?status=${status}`,
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
