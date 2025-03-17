import { instance } from "../instance";

export const login = async (username, password) => {
  try {
    const response = await instance.post("auth/login", {
      username,
      password,
    });

    if (response?.code === 200) {
      // Lưu thời gian hết hạn token (5 giờ từ thời điểm hiện tại)
      const expirationTime = new Date().getTime() + 5 * 60 * 60 * 1000; // 5 giờ tính bằng milliseconds
      localStorage.setItem("userTokenExpiration", expirationTime.toString());
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return {
      error: true,
      message: error.response?.data?.message || "Login failed!",
    };
  }
};

// Hàm kiểm tra token có hết hạn chưa
export const isTokenExpired = (tokenType = "user") => {
  const expirationKey =
    tokenType === "admin" ? "adminTokenExpiration" : "userTokenExpiration";
  const expiration = localStorage.getItem(expirationKey);

  if (!expiration) return true;

  return new Date().getTime() > parseInt(expiration);
};

// Hàm xóa token khi hết hạn
export const clearExpiredToken = (tokenType = "user") => {
  if (isTokenExpired(tokenType)) {
    if (tokenType === "admin") {
      localStorage.removeItem("adminUser");
      localStorage.removeItem("admin");
      localStorage.removeItem("token");
      localStorage.removeItem("adminTokenExpiration");
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("userTokenExpiration");
    }
    return true;
  }
  return false;
};
