import { create } from "zustand";
import { apiCall } from '@/helper/apiCall';
import { useAuthStore } from "./auth-store";
import { toast } from "react-toastify";

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  is_verified: boolean;
  image_url?: string | null;
  bio?: string | null;
  date_of_birth?: string | null;
}

interface UserState {
  loading: boolean;
  error: string | null;
  updateProfile: (data: FormData) => Promise<boolean>;
  updateProfilePicture: (file: File) => Promise<boolean>;
  fetchProfile: () => Promise<UserProfile | null>;
  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  resendVerificationEmail: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  loading: false,
  error: null,

  updateProfile: async (formData) => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().token;
      const res = await apiCall.put("/api/user/profile", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const user = res.data.data;
      localStorage.setItem("user", JSON.stringify(user));
      useAuthStore.getState().setUserAndToken(user, token!);

      set({ loading: false });

      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || "Gagal update profil",
      });
      return false;
    }
  },

  updateProfilePicture: async (file) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const formData = new FormData();

      formData.append("image", file);

      const res = await apiCall.put("/api/user/profile-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const user = res.data.data;
      localStorage.setItem("user", JSON.stringify(user));
      useAuthStore.getState().setUserAndToken(user, token!);

      set({ loading: false });
      toast.success("Foto profil berhasil diperbarui!");

      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || "Gagal update foto",
      });

      toast.error(err.response?.data?.message || "Gagal update foto");
      return false;
    }
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await apiCall.get("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ loading: false });
      return res.data.data as UserProfile;
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || "Gagal mengambil profil",
      });
      return null;
    }
  },

    resendVerificationEmail: async () => { 
        try {
            const { user, token } = useAuthStore.getState();
            await apiCall.post("/api/auth/resend-verification", { email: user.email }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Email verifikasi berhasil dikirim ulang!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal kirim email verifikasi");
        }
    },


    changePassword: async (oldPassword: string, newPassword: string) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            await apiCall.put("/api/user/change-password", { oldPassword, newPassword }, {
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

      set({ loading: false });
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || "Gagal ganti password",
      });

      return false;
    }
  },
}));
