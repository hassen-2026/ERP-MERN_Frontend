import axios from "axios";

function normalizeApiBase(raw) {
  if (!raw) return "http://localhost:5000/api";
  // remove trailing slashes
  let base = raw.replace(/\/+$/g, "");
  // ensure it ends with /api
  if (!base.endsWith("/api")) base = `${base}/api`;
  return base;
}

export const API_BASE_URL = normalizeApiBase(process.env.REACT_APP_API_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export default apiClient;
