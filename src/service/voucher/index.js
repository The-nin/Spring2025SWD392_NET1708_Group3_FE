import { instance } from "../instance";

const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  return {
    error: true,
    message: error?.response?.result?.message || defaultMessage,
  };
};

export const getAllVouchers = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.get("/admin/vouchers", {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    return handleError(error, "Không thể lấy danh sách khuyến mãi");
  }
};

// 🔹 Lấy voucher theo ID
export const getVoucherById = async (voucherId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.get(`admin/vouchers/${voucherId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      error: false,
      result: response.data?.result,
      message: response.data?.message,
    };
  } catch (error) {
    return handleError(error, "Không thể lấy thông tin khuyến mãi");
  }
};

// 🔹 Cập nhật voucher
export const updateVoucher = async (voucherId, voucherData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.put(
      `admin/vouchers/${voucherId}`,
      voucherData,
      {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    return handleError(error, "Không thể cập nhật khuyến mãi");
  }
};

// 🔹 Tạo voucher mới
export const createVoucher = async (voucherData) => {
  const token = localStorage.getItem("token");
  try {
    console.log("Đang tạo voucher:", JSON.stringify(voucherData, null, 2));

    const response = await instance.post("admin/vouchers", voucherData, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Phản hồi API:", response.data);

    return {
      error: false,
      result: response.data?.result,
      message: response.data?.message || "Tạo khuyến mãi thành công",
    };
  } catch (error) {
    console.error("Lỗi phản hồi:", error.response?.data || error.message);
    return handleError(error, "Không thể tạo khuyến mãi");
  }
};

// 🔹 Xóa voucher (Yêu cầu quyền Admin)
export const deleteVoucher = async (voucherId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.delete(`admin/vouchers/${voucherId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response && response.code === 200) {
      return {
        error: false,
        result: response.result,
        message: response.message,
      };
    }
    throw new Error(response?.message || "Phản hồi không hợp lệ");
  } catch (error) {
    return handleError(error, "Không thể xóa khuyến mãi");
  }
};

// 🔹 Cập nhật trạng thái voucher
export const updateVoucherStatus = async (voucherId, status) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.patch(
      `admin/vouchers/${voucherId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response && response.code === 200) {
      return {
        error: false,
        result: response.result,
        message: response.message,
      };
    }
    throw new Error(response?.message || "Phản hồi không hợp lệ");
  } catch (error) {
    return handleError(error, "Không thể cập nhật trạng thái khuyến mãi");
  }
};

// 🔹 Lấy danh sách voucher của tôi
export const getMyVouchers = async (page = 0, size = 10) => {
  try {
    const response = await instance.get(
      `/vouchers/my-voucher?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Không thể lấy danh sách khuyến mãi: ", error);
    return {
      error: true,
      message: error.response?.message || "Có lỗi xảy ra khi lấy khuyến mãi",
    };
  }
};

// 🔹 Lấy danh sách voucher có sẵn để đổi
export const getAvailableVouchers = async (page = 0, size = 10) => {
  try {
    const response = await instance.get(`/vouchers?page=${page}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Không thể lấy danh sách khuyến mãi có sẵn: ", error);
    return {
      error: true,
      message:
        error.response?.message || "Có lỗi xảy ra khi lấy danh sách khuyến mãi",
    };
  }
};

// 🔹 Đổi voucher
export const exchangeVoucher = async (voucherId) => {
  const response = await instance.post(
    `/vouchers/exchange-voucher/${voucherId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response;
};

export default {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  updateVoucherStatus,
  getMyVouchers,
  getAvailableVouchers,
  exchangeVoucher,
};
