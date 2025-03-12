import { instance } from "../instance";

export const register = async (data) => {
  try {
    const response = await instance.post("/auth/register", data);
    return response;
  } catch (error) {
    console.error("Register error:", error);
    return {
      error: true,
      message: error.response?.message || "Registration failed",
    };
  }
};

export const verifyOTP = async (userId, otpCode) => {
  try {
    const response = await instance.post("/auth/verify-otp", null, {
      params: {
        userId,
        otpCode,
      },
    });
    return response;
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      error: true,
      message: error.response?.message || "OTP verification failed",
    };
  }
};
