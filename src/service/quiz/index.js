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
        "Content-Type": "application/json",
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

// ✅ Submit a quiz (Admin Access Required)
export const addQuiz = async (quizId, quizData) => {
  const token = localStorage.getItem("token");

  try {
    console.log("📤 Submitting Quiz:", JSON.stringify(quizData, null, 2)); // ✅ Logs the request body

    const response = await instance.post(`/admin/quizs/${quizId}`, quizData, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ API Response:", response.data); // ✅ Logs the response if successful

    return {
      error: false,
      result: response.data?.result,
      message: response.data?.message,
    };
  } catch (error) {
    console.error("❌ Error Response:", error.response?.data || error.message);
    return handleError(error, "Failed to submit quiz");
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
      message: response.data?.message,
    };
  } catch (error) {
    return handleError(error, "Failed to delete quiz");
  }
};

// ✅ Update quiz status (Admin Access Required)
export const updateQuizStatus = async (quizId, status) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.patch(
      `/quizs/${quizId}/status`,
      { status },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      error: false,
      result: response.data?.result,
      message: response.data?.message,
    };
  } catch (error) {
    return handleError(error, "Failed to update quiz status");
  }
};
