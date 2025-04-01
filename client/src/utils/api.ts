import axios from "axios";

// Create an axios instance with base URL
const api = axios.create({
  // This would be your backend API URL
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
    // For demo purposes only - in a real app, you would use:
    // const response = await api.post('/auth/login', { email, password });
    // return response.data;

    // Mock successful login
    return {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJleHAiOjE5MTYyMzkwMjJ9.oB3MmYKw8e1VR6Uwt-9q0LVwuWU-c842s9gqGN-G_FU",
      user: {
        id: "123",
        username: "testuser",
        email: "test@test.com",
      },
    };
  } catch (error) {
    throw error;
  }
};

export const register = async (
  /* username: string, email: string, password: string */
) => {
  try {
    // For demo purposes only - in a real app, you would use:
    // const response = await api.post('/auth/register', { username, email, password });
    // return response.data;

    // Mock successful registration
    return {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJleHAiOjE5MTYyMzkwMjJ9.oB3MmYKw8e1VR6Uwt-9q0LVwuWU-c842s9gqGN-G_FU",
      user: {
        id: "123",
        username: "testuser",
        email: "test@test.com",
      },
    };
  } catch (error) {
    throw error;
  }
};

export default api;
