import { instance } from "../instance";

export const login = async (username, password) => {
  try {
    const response = await instance.post("auth/login", {
      username,
      password,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return {
      error: true,
      message: error.response?.data?.message || "Login failed!",
    };
  }
};
