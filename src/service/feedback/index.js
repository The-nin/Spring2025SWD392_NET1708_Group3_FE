import { instance } from "../instance";

/**
 * Thêm đánh giá mới cho sản phẩm (yêu cầu xác thực)
 * @param {string} productId - ID của sản phẩm cần đánh giá
 * @param {number} orderId - ID của đơn hàng
 * @param {number} orderItemIndex - Index của item trong đơn hàng
 * @param {object} feedbackData - Dữ liệu đánh giá (description, rating)
 * @returns {Promise} - Promise chứa kết quả API
 */
export const addProductFeedback = async (
  productId,
  orderId,
  orderItemIndex,
  feedbackData
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        error: true,
        message: "Vui lòng đăng nhập để đánh giá sản phẩm",
        requireAuth: true,
      };
    }

    // Kiểm tra dữ liệu đầu vào
    if (!productId) {
      return {
        error: true,
        message: "Thiếu thông tin sản phẩm",
        validationError: true,
      };
    }

    // Chuẩn bị dữ liệu gửi đi
    const payload = {
      description: feedbackData.description?.trim(),
      rating: Number(feedbackData.rating),
    };

    // Gọi API theo đúng định dạng Swagger
    const response = await instance.post(`/feedbacks/${productId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.code === 200 || response.code === 201) {
      return {
        error: false,
        result: response.result,
        message: response.message || "Đánh giá sản phẩm thành công",
      };
    }

    return {
      error: true,
      message: response.message || "Không thể gửi đánh giá",
    };
  } catch (error) {
    console.error("Feedback API Error:", error);

    if (error.response?.status === 401 || error.response?.data?.code === 1201) {
      localStorage.removeItem("token");
      return {
        error: true,
        message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
        requireAuth: true,
      };
    }

    if (error.response?.status === 400) {
      return {
        error: true,
        message: error.response.data?.message || "Dữ liệu không hợp lệ",
        validationError: true,
      };
    }

    if (error.response?.status === 403) {
      return {
        error: true,
        message: "Bạn không có quyền thực hiện chức năng này",
        forbidden: true,
      };
    }

    return {
      error: true,
      message: error.response?.data?.message || "Không thể kết nối đến server",
    };
  }
};
