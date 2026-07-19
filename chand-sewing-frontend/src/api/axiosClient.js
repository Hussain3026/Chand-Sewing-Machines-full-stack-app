import axios from "axios";

// Central axios instance — now pointed at your real backend.
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the login token (if any) to every request automatically.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("csm_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong while talking to the server.";
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
