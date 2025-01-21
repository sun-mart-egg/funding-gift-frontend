import axios from "axios";
import { getCookie } from "./cookies";

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// axios 요청 마다 자동으로 headers에 access-token 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("access-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config;
  },
  (error) => {
    return Promise.reject(error)
  }
);

export default axiosInstance;