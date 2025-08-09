// Import necessary React hooks and custom Axios instance
import { createContext, useState, useEffect } from "react";
import api from "../apis/axios.js";

// Create the authentication context so it can be accessed in any component
export const AuthContext = createContext();

// AuthProvider will wrap our app to provide authentication state and functions
export const AuthProvider = ({ children }) => {
  // State to store user info (email & role) and loading status
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Login function
   * - Sends email & password to backend
   * - Stores tokens & user info in localStorage
   * - Updates the `user` state
   */
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });

    // Save tokens and user info in local storage
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("email", data.email);
    localStorage.setItem("role", data.role);

    // Update the context state
    setUser({ email: data.email, role: data.role });
  };

  /**
   * Logout function
   * - Clears tokens and user info from localStorage
   * - Resets the `user` state
   */
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  /**
   * Refresh Access Token
   * - Uses refresh token to get a new access token from backend
   * - Updates localStorage with the new token
   * - If refresh fails, logs the user out
   */
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token found");

      const { data } = await api.post("/auth/refresh", { refreshToken });

      // Store new access token
      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
    }
  };

  /**
   * Axios Response Interceptor
   * - Automatically tries to refresh token if access token is expired (401 error)
   * - Retries the original request with the new token
   */
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If unauthorized & refresh token exists & request not retried yet
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          localStorage.getItem("refreshToken")
        ) {
          originalRequest._retry = true;
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return api(originalRequest); // Retry request
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup: Remove interceptor when component unmounts
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  /**
   * On App Load:
   * - Check if tokens and user info are stored in localStorage
   * - If yes, set the user state
   * - Mark loading as false
   */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    if (token && role && email) {
      setUser({ email, role });
    }
    setLoading(false);
  }, []);

  // Provide `user`, `login`, `logout`, and `loading` states/functions to children
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
