import axios from "axios";
import { BACKEND_API_KEY } from "./ApiKey";

const api = axios.create({
  baseURL: BACKEND_API_KEY,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || "";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
