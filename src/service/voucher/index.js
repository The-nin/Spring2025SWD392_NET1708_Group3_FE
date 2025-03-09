import { instance } from "../instance";

const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  return {
    error: true,
    message: error?.response?.data?.message || defaultMessage,
  };
};

// 🔹 Fetch all vouchers (Guest Access)
export const getAllVouchers = async () => {
  try {
    const response = await instance.get("vouchers/alls"); // ✅ Matches backend route
    console.log(response);
    return {
      error: false,
      result: response.result,
      message: response.message,
    };
  } catch (error) {
    return handleError(error, "Failed to fetch vouchers");
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
  try {
    const response = await instance.get(`/vouchers/${voucherId}`);

    console.log("Full API Response:", response);

    if (!response) {
      throw new Error("API response is missing or undefined");
    }

    return {
      error: false,
      result: response,
      message: "Voucher retrieved successfully",
    };
  } catch (error) {
    console.error("API Request Error:", error);

    return {
      error: true,
      result: null,
      message: error.message || "Failed to fetch voucher details",
    };
  }
};

// 🔹 Create a new voucher (Admin Access Required)
export const createVoucher = async (voucherData) => {
  const token = localStorage.getItem("token");
  try {
    console.log("Creating Voucher:", JSON.stringify(voucherData, null, 2));

    const response = await instance.post("admin/voucher", voucherData, {
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

// 🔹 Update an existing voucher (Admin Access Required)
export const updateVoucher = async (id, voucherData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await instance.put(
      `admin/voucher/${id}`, // ✅ API URL with ID
      {
        voucherName: voucherData.voucherName, // ✅ Corrected field
        voucherCode: voucherData.voucherCode, // ✅ Corrected field
        point: Number(voucherData.point), // Ensure integer
        startDate: voucherData.startDate, // Keep as string (YYYY-MM-DD)
        endDate: voucherData.endDate, // Keep as string (YYYY-MM-DD)
        description: voucherData.description, // ✅ Corrected field
        discountAmount: parseFloat(voucherData.discountAmount), // Ensure float
        status: voucherData.status, // ✅ Corrected field
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      error: false,
      result: response.data?.result, // Ensure correct response handling
      message: response.data?.message || "Voucher updated successfully",
    };
  } catch (error) {
    console.error(
      "Update voucher error:",
      error.response?.data || error.message
    );

    return {
      error: true,
      message: error.response?.data?.message || "Failed to update voucher",
    };
  }
};

// 🔹 Delete a voucher (Admin Access Required)
export const deleteVoucher = async (voucherId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await instance.delete(`/vouchers/${voucherId}`, {
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
