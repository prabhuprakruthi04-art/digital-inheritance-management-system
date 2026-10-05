import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => {
    if (
      typeof response.data === "string" &&
      response.data.includes("<!doctype")
    ) {
      return Promise.reject(
        new Error("Received HTML response from server instead of JSON.")
      );
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const contentType = error.response?.headers?.["content-type"] || "";

    if (
      contentType.includes("text/html") ||
      (typeof error.response?.data === "string" &&
        error.response?.data.includes("<!doctype"))
    ) {
      error.message = `API endpoint not found on server (${status || 404}). Check backend routing.`;
    }

    if (status === 401) {
      const requestUrl = error.config?.url || "";
      const isLoginOrBiometric =
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/signin") ||
        requestUrl.includes("/biometrics") ||
        requestUrl.includes("/face");

      if (!isLoginOrBiometric) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth-expired"));
      }
    }
    return Promise.reject(error);
  }
);

export default API;