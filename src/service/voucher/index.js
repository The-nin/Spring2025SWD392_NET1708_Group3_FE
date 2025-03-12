import { instance } from "../instance";

const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  return {
    error: true,
    message: error?.response?.data?.message || defaultMessage,
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

// 🔹 Fetch vouchers for logged-in users
export const getUserVouchers = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.get("/vouchers/system/all", {
      headers: { authorization: `Bearer ${token}` },
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
export const getVoucherById = async (voucherId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.get(`admin/vouchers/${voucherId}`, {
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

// 🔹 Create a new voucher (Admin Access Required)
export const createVoucher = async (voucherData) => {
  const token = localStorage.getItem("token");
  try {
    console.log("Creating Voucher:", JSON.stringify(voucherData, null, 2));

    const response = await instance.post("admin/vouchers", voucherData, {
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

// 🔹 Delete a voucher (Admin Access Required)
export const deleteVoucher = async (voucherId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.delete(`admin/vouchers/${voucherId}`, {
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

// 🔹 Update voucher status (Admin Access Required)
export const updateVoucherStatus = async (voucherId, status) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.patch(
      `/admin/voucher/${voucherId}?status=${status}`, // Corrected API endpoint
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

// Export all API functions
export default {
  getAllVouchers,
  getUserVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  updateVoucherStatus,
};
