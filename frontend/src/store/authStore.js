import { create } from "zustand";
import axios from "axios";

export const authStore = create((set, get) => ({
  currentUser: null,
  loading: true, // Start with loading: true to wait for checkAuth on mount
  error: null,
  isAuthenticated: false,
  login: async (userCredWithRole) => {

    const { role, ...userCred } = userCredWithRole;
    try {
      set({ loading: true, error: null });
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/common-api/login`, userCred, { withCredentials: true });
      console.log("Login Response:", res.data);

      set({
        loading: false,
        error: null,
        isAuthenticated: true,
        currentUser: res.data.payload
      });
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      set({
        loading: false,
        error: errorMessage,
        isAuthenticated: false,
        currentUser: null
      });
    }
  },
  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await axios.get("http://localhost:3000/common-api/verify-auth", { withCredentials: true });
      set({
        isAuthenticated: true,
        currentUser: res.data.payload,
        loading: false
      });
    } catch (error) {
      // 400 = no token (guest), 401/403 = invalid/expired/forbidden token
      if (error.response?.status === 400 || error.response?.status === 401 || error.response?.status === 403) {
        set({
          isAuthenticated: false,
          currentUser: null,
        });
      }
      set({ loading: false });
    }
  },
  logout: async () => {
    set({ loading: true, error: null });
    try {
      await axios.get("http://localhost:3000/common-api/logout", { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({
        currentUser: null,
        loading: false,
        error: null,
        isAuthenticated: false
      });
    }
  }
}));