import { instance } from "../instance";

export const getDashboardData = async (startDate, endDate) => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");

    // Build URL with query parameters if dates are provided
    let url = "/admin/dashboard";
    if (startDate && endDate) {
      url += `?startDate=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(endDate)}`;
    }

    const response = await instance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return {
      error: true,
      message: error.response?.message || "Failed to fetch dashboard data",
    };
  }
};
