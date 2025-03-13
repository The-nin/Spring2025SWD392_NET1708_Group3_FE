import { instance } from "../instance";

const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  return {
    error: true,
    message: error?.response?.data?.message || defaultMessage,
  };
};

export const getAllQuizs = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.get("/quizs/all", {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch quizzes");
  }
};

// ✅ Fetch quiz details by ID (Admin Access Required)
export const getQuizById = async (quizId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.get(`/admin/quizs/${quizId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return {
      error: false,
      result: response.data?.result,
      message: response.data?.message,
    };
  } catch (error) {
    return handleError(error, "Failed to fetch quiz details");
  }
};

export const addQuiz = async (quizData) => {
  const token = localStorage.getItem("token");
  try {
    console.log("Creating Voucher:", JSON.stringify(quizData, null, 2));

    const response = await instance.post("admin/quizs", quizData, {
      // ✅ Fixed route
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("API Response:", response.data);

    return {
      error: false,
      result: response.data?.result,
      message: response.data?.message || "Voucher created successfully",
    };
  } catch (error) {
    console.error("Error Response:", error.response?.data || error.message);
    return handleError(error, "Failed to create voucher");
  }
};

// ✅ Update an existing quiz (Admin Access Required)
export const updateQuiz = async (quizId, quizData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.put(`/admin/quizs/${quizId}`, quizData, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return {
      error: false,
      result: response.data?.result,
      message: response.data?.message,
    };
  } catch (error) {
    return handleError(error, "Failed to update quiz");
  }
};

// ✅ Delete a quiz (Admin Access Required)
export const deleteQuiz = async (quizId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.delete(`/admin/quizs/${quizId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return {
      error: false,
      result: response.data?.result,
      message: response.data?.message || "Voucher deleted successfully",
    };
  } catch (error) {
    return handleError(error, "Failed to delete voucher");
  }
};

export const updateQuizStatus = async (quizId, status) => {
  try {
    const token = localStorage.getItem("token");
    console.log(quizId, status);
    const response = await instance.patch(
      `/admin/quizs/changeStatus/${quizId}?status=${status}`,
      { status }, // Send status in the request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      error: false,
      result: response.data?.result, // Ensure correct response data
      message: response.data?.message,
    };
  } catch (error) {
    console.error("Update blog status error:", error);
    return {
      error: true,
      message: error.response?.data?.message || "Failed to update blog status",
    };
  }
};
// ✅ Update quiz status (Admin Access Required)
