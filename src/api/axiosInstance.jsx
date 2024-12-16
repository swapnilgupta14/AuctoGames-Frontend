import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://server.rishabh17704.workers.dev/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("shopCoToken") || ""}`,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const axiosInstanceAdmin = axios.create({
  baseURL: "https://server.rishabh17704.workers.dev/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstanceAdmin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstanceAdmin.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminAuth");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstanceAdmin;
