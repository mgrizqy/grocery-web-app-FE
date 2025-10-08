import { create } from "zustand";
import { apiCall } from "@/helper/apiCall";
import { toast } from "react-toastify";
import { useAuthStore } from "./auth-store";
import { useOrderDetailStore } from "./order-detail-store";

interface UploadProofState {
  file: File | null;
  previewUrl: string | null;
  loading: boolean;
  error: string | null;
  setFile: (file: File | null) => void;
  uploadProof: (
    orderId: number
  ) => Promise<{ success: boolean; message?: string }>;
  reset: () => void;
}

export const useUploadProofStore = create<UploadProofState>((set, get) => ({
  file: null,
  previewUrl: null,
  loading: false,
  error: null,

  setFile: (file) => {
    if (get().previewUrl) {
      URL.revokeObjectURL(get().previewUrl!);
    }
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error("File size cannot exceed 1MB.");
        set({ file: null, previewUrl: null });
        return;
      }
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        toast.error("Only .jpg, .png, or .gif files are allowed.");
        set({ file: null, previewUrl: null });
        return;
      }
      const preview = URL.createObjectURL(file);
      set({ file, previewUrl: preview, error: null });
    } else {
      set({ file: null, previewUrl: null });
    }
  },

  uploadProof: async (orderId) => {
    const { file } = get();
    if (!file) {
      const errorMsg = "Please select a file to upload.";
      toast.error(errorMsg);
      set({ error: errorMsg });
      return { success: false, message: errorMsg };
    }

    set({ loading: true, error: null });
    const token = useAuthStore.getState().token;
    if (!token) {
      const errorMsg = "Authentication required.";
      toast.error(errorMsg);
      set({ loading: false, error: errorMsg });
      return { success: false, message: errorMsg };
    }

    const formData = new FormData();
    formData.append("paymentProof", file);

    try {
      const response = await apiCall.post(
        `/api/orders/${orderId}/upload-proof`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Payment proof uploaded successfully!");
      // Re-fetch the order details to get the new status
      await useOrderDetailStore.getState().fetchOrder(orderId);
      set({ loading: false });
      return { success: true, message: response.data.message };
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to upload payment proof.";
      toast.error(errorMsg);
      set({ loading: false, error: errorMsg });
      return { success: false, message: errorMsg };
    }
  },

  reset: () => {
    if (get().previewUrl) {
      URL.revokeObjectURL(get().previewUrl!);
    }
    set({ file: null, previewUrl: null, loading: false, error: null });
  },
}));
