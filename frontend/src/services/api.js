// src/services/api.js
import axios from "axios";

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "http://172.27.70.203:5000/api";

// ✅ Create axios client
const apiClient = axios.create({ baseURL: API_BASE_URL });

// ✅ Attach token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("farm_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Centralized request handler
const handleRequest = async (request) => {
  try {
    const res = await request;
    return res.data;
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    throw err.response?.data || { message: "Server error" };
  }
};

const api = {
  // ---------- Auth ----------
  login: (credentials) =>
    handleRequest(apiClient.post("/auth/login", credentials)),

  signup: (data) =>
    handleRequest(apiClient.post("/auth/signup", data)),

  // ---------- Production ----------
  getProduction: () => handleRequest(apiClient.get("/production")),
  addProduction: (data) => handleRequest(apiClient.post("/production", data)),

  // ---------- Prices ----------
  getCurrentPrices: () => handleRequest(apiClient.get("/prices")),
  updatePrice: (product, price) =>
    handleRequest(apiClient.put(`/prices/${product}`, { price })),

  // ---------- Income ----------
  getMonthlyIncome: () =>
    handleRequest(apiClient.get("/production/income/monthly")),
  getCurrentMonthIncome: () =>
    handleRequest(apiClient.get("/production/income/current")),
  getIncomeByProductMonthly: () =>
    handleRequest(apiClient.get("/production/income/by-product")),
  getTodayIncome: () =>
    handleRequest(apiClient.get("/production/income/today")),

  // ---------- Dashboard ----------
  getTodayProductsCount: () =>
    handleRequest(apiClient.get("/production/today-products-count")), // ✅ NEW
};

export default api;
