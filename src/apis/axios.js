import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// Attach access token to each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh if 401 is returned
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post(
          "http://localhost:8080/api/v1/auth/refresh",
          { refreshToken }
        );

        // Save new tokens and user info
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("email", data.email);
        localStorage.setItem("role", data.role);

        // Retry the failed request
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
