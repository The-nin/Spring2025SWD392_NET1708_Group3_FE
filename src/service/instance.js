import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:8080/api/v1/swd392-skincare-products-sales-system",
  withCredentials: true,
});

instance.interceptors.response.use(function (response) {
  return response.data;
});

//  "https://spring2025swd392-net1708-3.onrender.com/api/v1/swd392-skincare-products-sales-system",
