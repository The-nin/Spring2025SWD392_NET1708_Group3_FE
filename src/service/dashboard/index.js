import { instance } from "../instance";

const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  return {
    error: true,
    message: error?.response?.data?.message || defaultMessage,
  };
};
export const getDashboardData = async () => {
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
    return handleError(error, "Lỗi khi gọi API");
  }
};
