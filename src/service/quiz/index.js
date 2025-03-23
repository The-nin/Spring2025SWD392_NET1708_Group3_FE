import { instance } from "../instance";

const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  return {
    error: true,
    message: error?.response?.data?.message || defaultMessage,
  };
};

export const getAllQuizs = async () => {
  try {
    const response = await instance.get("/quizs/all", {});
    return response;
  } catch (error) {
    return handleError(error, "Không thể lấy danh sách Bộ trắc nghiệm");
  }
};

// ✅ Lấy chi tiết Quiz theo ID (Yêu cầu quyền Admin)

export const getQuizById = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.get(`/admin/quizs/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    return handleError(error, "Không thể lấy chi tiết Bộ trắc nghiệm");
  }
};

export const addQuiz = async (quizData) => {
  const token = localStorage.getItem("token");
  try {
    console.log("Đang tạo Bộ trắc nghiệm:", JSON.stringify(quizData, null, 2));

    const response = await instance.post("admin/quizs", quizData, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Phản hồi API:", response.data);

    return {
      error: false,
      result: response.data?.result,
      message: response.data?.message || "Tạo Bộ trắc nghiệm thành công",
    };
  } catch (error) {
    console.error("Lỗi phản hồi:", error.response?.data || error.message);
    return handleError(error, "Không thể tạo Bộ trắc nghiệm");
  }
};

// ✅ Cập nhật Quiz (Yêu cầu quyền Admin)
export const updateQuiz = async (quizId, quizData) => {
  console.log("📤 Dữ liệu Quiz:", JSON.stringify({ quizData }, null, 2));

  const token = localStorage.getItem("token");

  try {
    const response = await instance.put(`/admin/quizs/${quizId}`, quizData, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return {
      success: response.status === 200 || response.status === 201,
      result: response.data?.result ?? null,
      message: response.data?.message ?? "Cập nhật Bộ trắc nghiệm thành công!",
    };
  } catch (error) {
    return handleError(error, "Không thể cập nhật Bộ trắc nghiệm");
  }
};

// ✅ Xóa Quiz (Yêu cầu quyền Admin)
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
      message: response.data?.message || "Xóa Bộ trắc nghiệm thành công",
    };
  } catch (error) {
    return handleError(error, "Không thể xóa Bộ trắc nghiệm");
  }
};

export const updateQuizStatus = async (quizId, status) => {
  try {
    const token = localStorage.getItem("token");
    console.log(quizId, status);
    const response = await instance.patch(
      `/admin/quizs/changeStatus/${quizId}?status=${status}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      error: false,
      result: response.data?.result,
      message:
        response.data?.message ||
        "Cập nhật trạng thái Bộ trắc nghiệm thành công",
    };
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái Bộ trắc nghiệm:", error);
    return {
      error: true,
      message:
        error.response?.data?.message ||
        "Không thể cập nhật trạng thái Bộ trắc nghiệm",
    };
  }
};

export const submitQuizAnswers = async (quizId, answers) => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");

    // Format dữ liệu câu trả lời theo yêu cầu mới của API
    // Truyền trực tiếp id câu hỏi và id câu trả lời
    const formattedAnswers = {};

    // Chuyển đổi từ {questionId: answerId} thành cấu trúc mới
    Object.keys(answers).forEach((questionId) => {
      formattedAnswers[questionId] = answers[questionId];
    });

    const requestData = {
      answers: formattedAnswers,
    };

    console.log("Submitting quiz answers:", requestData);

    const response = await instance.post(
      `/quizs/submit/${quizId}`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error submitting quiz answers:", error);
    return {
      error: true,
      message: error.response?.message || "Failed to submit quiz answers",
      details: error.response?.data,
    };
  }
};
