import axios from "axios";
import { BASE_URL } from "./apiEndpoints";

const axiosConfig = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const excludeList = ["/login", "/register", "/status", "/activate", "/health"];

axiosConfig.interceptors.request.use(
  (config) => {
    const shouldSkipToken = excludeList.some((endpoint) =>
      config.url?.includes(endpoint),
    );

    if (!shouldSkipToken) {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    } else if (error.response?.status === 501) {
      console.log("Please try again later");
    } else if (error.code === "ECONNABORTED") {
      console.error("request timeout");
    }

    return Promise.reject(error);
  },
);

export default axiosConfig;
