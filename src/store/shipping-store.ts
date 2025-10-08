import { create } from "zustand";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "./auth-store";
import { toast } from "react-toastify";
import { ShippingOption } from "@/components/types";

interface ShippingState {
  options: ShippingOption[];
  loading: boolean;
  error: string | null;
  fetchOptions: (
    addressId: number,
    storeId: number
  ) => Promise<ShippingOption[] | null>;
}

export const useShippingStore = create<ShippingState>((set) => ({
  options: [],
  loading: false,
  error: null,

  fetchOptions: async (addressId, storeId) => {
    set({ loading: true, error: null, options: [] });

    const token = useAuthStore.getState().token;
    if (!token) {
      set({ loading: false, error: "Authentication required." });
      return null;
    }

    try {
      const response = await apiCall.post(
        "/api/shipping/options",
        { addressId, storeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = response.data.data as ShippingOption[];
      set({ options, loading: false });
      return options;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch shipping options.";
      toast.error(errorMsg);
      set({ error: errorMsg, loading: false, options: [] });
      return null;
    }
  },
}));
