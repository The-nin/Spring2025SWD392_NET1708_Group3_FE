import { toast } from "react-toastify";

export const handleApiResponse = (response, successCallback) => {
  if (!response.error) {
    // Nếu API trả về thành công
    if (response.message) {
      toast.success(response.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    // Thực hiện callback nếu có
    if (successCallback) {
      successCallback(response);
    }
    return true;
  } else {
    // Nếu API trả về lỗi
    toast.error(response.message || "An error occurred", {
      position: "top-right",
      autoClose: 3000,
    });
    return false;
  }
};
