// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://level-23.onrender.com/level-23", // 🔁 change to your API URL
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── REQUEST INTERCEPTOR ───────────────────────────────────
// Runs BEFORE every request — attach token here
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ──────────────────────────────────
// Runs AFTER every response — unwrap data, handle 401
axiosInstance.interceptors.response.use(
  (response) => response.data, // ✅ auto-unwrap .data
  (error) => {
    if (error.response?.status === 401) {
      // token expired → redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;