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
    return handleError(error, "Không thể lấy danh sách Quiz");
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
    return handleError(error, "Không thể lấy chi tiết Quiz");
  }
};

export const addQuiz = async (quizData) => {
  const token = localStorage.getItem("token");
  try {
    console.log("Đang tạo Quiz:", JSON.stringify(quizData, null, 2));

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
      message: response.data?.message || "Tạo Quiz thành công",
    };
  } catch (error) {
    console.error("Lỗi phản hồi:", error.response?.data || error.message);
    return handleError(error, "Không thể tạo Quiz");
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
      message: response.data?.message ?? "Cập nhật Quiz thành công!",
    };
  } catch (error) {
    return handleError(error, "Không thể cập nhật Quiz");
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
      message: response.data?.message || "Xóa Quiz thành công",
    };
  } catch (error) {
    return handleError(error, "Không thể xóa Quiz");
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
      message: response.data?.message || "Cập nhật trạng thái Quiz thành công",
    };
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái Quiz:", error);
    return {
      error: true,
      message:
        error.response?.data?.message || "Không thể cập nhật trạng thái Quiz",
    };
  }
};
