import { create } from "zustand";
import axios from "axios";

export const authStore = create((set, get) => ({
  currentUser: null,
  loading: true, // Start with loading: true to wait for checkAuth on mount
  error: null,
  isAuthenticated: false,
  login: async (userCredWithRole) => {
    // Note: role is destructured but not used in the common-api/login currently
    const { role, ...userCred } = userCredWithRole;
    try {
      set({ loading: true, error: null });
      const res = await axios.post("http://localhost:3000/common-api/login", userCred, { withCredentials: true });
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
      // Only reset if it's a definitive auth failure (401/403)
      if (error.response?.status === 401 || error.response?.status === 403) {
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