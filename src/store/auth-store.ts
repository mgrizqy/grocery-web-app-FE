import { create } from "zustand";
import { apiCall } from "@/helper/apiCall";
import { useCartStore } from "./cart-store";

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isHydrated: boolean;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  hydrate: () => void;
  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
  }) => Promise<boolean>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  setUserAndToken: (user: any, token: string) => void;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  verifyEmail: (token: string, password: string) => Promise<boolean>;
  verifyNewEmail: (token: string) => Promise<boolean>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  isHydrated: false,

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await apiCall.post("/api/auth/register", data);
      set({ user: { email: res.data.data.email }, loading: false });

      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || "Gagal daftar",
      });

      return false;
    }
  },

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await apiCall.post("/api/auth/login", data);
      const { user, token } = res.data.data;

      set({ user, token, loading: false });
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      useCartStore.getState().fetchCart(token);

      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Login gagal",
        loading: false,
      });
      return false;
    }
  },

  logout: () => {
    const resetCart = useCartStore.getState().resetCart;
    resetCart();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("applied_promo");
    sessionStorage.removeItem("token");

    set({ user: null, token: null });
  },

  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const userItem = localStorage.getItem("user");
      if (token && userItem) {
        set({ token, user: JSON.parse(userItem) });
      } else {
        set({ user: null, token: null });
      }
    } catch (e) {
      console.error("Failed to hydrate auth store:", e);
      set({ user: null, token: null });
    } finally {
      set({ isHydrated: true });
    }
  },

  loginWithGoogle: async (idToken) => {
    set({ loading: true, error: null });
    try {
      const res = await apiCall.post("/api/auth/google-login", { idToken,});
      const { user, token } = res.data.data;
      set({ user, token, loading: false });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || "Login Google gagal",
      });
    }
  },

  setUserAndToken: (user, token) => set({ user, token }),

  verifyEmail: async (token, password) => {
    set({ loading: true, error: null });
    try {
      await apiCall.post("/api/auth/verify-email", {
        token,
        password,
      });
      set({ loading: false });
      return true;
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Verifikasi gagal.",
      });
      return false;
    }
  },

  requestPasswordReset: async (email) => {
    set({ loading: true, error: null });
    try {
      await apiCall.post("/api/auth/request-reset", { email });
      set({ loading: false });

      return true;
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Gagal meminta reset password",
      });

      return false;
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ loading: true, error: null });
    try {
      await apiCall.post("/api/auth/reset-password", {
        token,
        new_password: newPassword,
      });
      set({ loading: false });
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || "Gagal reset password",
      });
      return false;
    }
  },

  verifyNewEmail: async (token: string) => {
    set({ loading: true, error: null });
    try {
      const res = await apiCall.post(`/api/user/verify-new-email`, { token });
      set({ user: res.data.data, loading: false });
      return true;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Verifikasi gagal";
      set({ error: message, loading: false });
      return false;
    }
  },
  clearAuth: () => set({ user: null, token: null }),
}));