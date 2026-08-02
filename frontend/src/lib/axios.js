import axios from "axios";

// allow overriding API URL via Vite env `VITE_API_URL`, fallback to localhost
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default axiosInstance;
