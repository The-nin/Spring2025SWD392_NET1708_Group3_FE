import axios from "axios";

export const instance = axios.create({
  baseURL:
    "https://swp391-skincare-products-sales-system.onrender.com/api/v1/swp391-skincare-products-sales-system",
  withCredentials: true,
});

instance.interceptors.response.use(function (response) {
  return response.data;
});
