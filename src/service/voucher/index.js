import { instance } from "../instance";

const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  return {
    error: true,
    message: error?.response?.result?.message || defaultMessage,
  };
};

// 🔹 Fetch all vouchers (Admin Access)
export const getAllVouchers = async (page = 0, size = 10) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.get(
      `admin/vouchers?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Thêm console.log để debug
    console.log("API Response:", response);

    // Kiểm tra response và code
    if (response && response.code === 200) {
      return {
        error: false,
        result: response.result.content || [], // Đảm bảo luôn trả về mảng
        pagination: {
          totalElements: response.result.totalElements || 0,
          totalPages: response.result.totalPages || 0,
          pageNumber: response.result.pageNumber || 0,
          pageSize: response.result.pageSize || 10,
        },
        message: response.message,
      };
    }

    // Nếu response không hợp lệ, throw error
    throw new Error(response?.message || "Invalid response format");
  } catch (error) {
    return handleError(error, "Failed to fetch vouchers");
  }
};

// 🔹 Get voucher by ID
export const getVoucherById = async (voucherId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.get(`admin/vouchers/${voucherId}`, {
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
    throw new Error(response?.message || "Invalid response format");
  } catch (error) {
    return handleError(error, "Failed to fetch voucher details");
  }
};

// 🔹 Create voucher
export const createVoucher = async (voucherData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.post("admin/vouchers", voucherData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response && response.code === 200) {
      return {
        error: false,
        result: response.result,
        message: response.message,
      };
    }
    throw new Error(response?.message || "Invalid response format");
  } catch (error) {
    return handleError(error, "Failed to create voucher");
  }
};

// 🔹 Update voucher
export const updateVoucher = async (id, voucherData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.put(`admin/vouchers/${id}`, voucherData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response && response.code === 200) {
      return {
        error: false,
        result: response.result,
        message: response.message,
      };
    }
    throw new Error(response?.message || "Invalid response format");
  } catch (error) {
    return handleError(error, "Failed to update voucher");
  }
};

// 🔹 Delete voucher
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
    throw new Error(response?.message || "Invalid response format");
  } catch (error) {
    return handleError(error, "Failed to delete voucher");
  }
};

// 🔹 Update voucher status
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
    throw new Error(response?.message || "Invalid response format");
  } catch (error) {
    return handleError(error, "Failed to update voucher status");
  }
};

export default {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  updateVoucherStatus,
};
