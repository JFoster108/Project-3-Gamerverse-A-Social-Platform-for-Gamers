import axios from "axios";

// Create an axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Example API functions (to be implemented with actual backend)
export const login = async (/* email: string, password: string */) => {
  try {
    return {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      user: { id: "123", username: "testuser", email: "test@test.com" },
    };
  } catch (error) {
    throw error;
  }
};

export const register = async (/* username: string, email: string, password: string */) => {
  try {
    return {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      user: { id: "123", username: "testuser", email: "test@test.com" },
    };
  } catch (error) {
    throw error;
  }
};

export default api;
