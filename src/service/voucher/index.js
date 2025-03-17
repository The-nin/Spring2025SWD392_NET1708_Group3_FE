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
    return handleError(error, "Failed to fetch blogs");
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

    return {
      error: false,
      result: response.data?.result,
      message: response.data?.message,
    };
  } catch (error) {
    return handleError(error, "Failed to fetch user vouchers");
  }
};

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
    return handleError(error, "Failed to fetch blogs");
  }
};

// 🔹 Create voucher
export const createVoucher = async (voucherData) => {
  const token = localStorage.getItem("token");
  try {
    // Validate discountType
    if (!["FIXED_AMOUNT", "PERCENTAGE"].includes(voucherData.discountType)) {
      throw new Error(
        "Invalid discount type. Must be either FIXED_AMOUNT or PERCENTAGE"
      );
    }

    const response = await instance.post("admin/vouchers", voucherData, {

      // ✅ Fixed route
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Request payload:", voucherData); // Debug log

    if (response && response.code === 200) {
      return {
        error: false,
        result: response.result,
        message: response.message,
      };
    }
    throw new Error(response?.message || "Invalid response format");
  } catch (error) {
    console.error("Create voucher error:", error.response?.data); // Debug log
    return handleError(error, "Failed to create voucher");
  }
};

// 🔹 Delete a voucher (Admin Access Required)
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
    return response; // Trả về trực tiếp response giống như getCart()
  } catch (error) {
    console.error("Cant get vouchers: ", error);
    return {
      error: true,
      message: error.response?.message || "Có lỗi xảy ra khi lấy voucher",
    };
  }
};

// Get available vouchers for exchange
export const getAvailableVouchers = async (page = 0, size = 10) => {
  try {
    const response = await instance.get(`/vouchers?page=${page}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Can't get available vouchers: ", error);
    return {
      error: true,
      message:
        error.response?.message || "Có lỗi xảy ra khi lấy danh sách voucher",
    };
  }
};

// Exchange voucher
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
