import { create } from "zustand";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "./auth-store";
import { toast } from "react-toastify";
import { OrderDetail } from "@/components/types";

interface OrderDetailState {
  order: OrderDetail | null;
  loading: boolean;
  error: string | null;
  fetchOrder: (orderId: number) => Promise<void>;
  cancelOrder: (orderId: number) => Promise<boolean>;
  confirmReceipt: (orderId: number) => Promise<boolean>;
  repayOrder: (
    orderId: number
  ) => Promise<{ success: boolean; token?: string }>;
  get: () => OrderDetailState;
}

export const useOrderDetailStore = create<OrderDetailState>((set, get) => ({
  order: null,
  loading: true,
  error: null,

  fetchOrder: async (orderId) => {
    set({ loading: true, error: null, order: null });
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ loading: false, error: "Authentication required." });
      return;
    }

    try {
      const response = await apiCall.get(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ order: response.data.data, loading: false });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch order details.";
      toast.error(errorMsg);
      set({ error: errorMsg, loading: false });
    }
  },

  cancelOrder: async (orderId) => {
    set({ loading: true });
    const token = useAuthStore.getState().token;
    try {
      await apiCall.patch(
        `/api/orders/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Order has been cancelled.");
      await get().fetchOrder(orderId);
      set({ loading: false });
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to cancel order.";
      toast.error(errorMsg);
      set({ loading: false, error: errorMsg });
      return false;
    }
  },

  confirmReceipt: async (orderId) => {
    set({ loading: true });
    const token = useAuthStore.getState().token;
    try {
      await apiCall.patch(
        `/api/orders/${orderId}/confirm-receipt`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Thank you for confirming your order!");
      await get().fetchOrder(orderId);
      set({ loading: false });
      return true;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to confirm receipt.";
      toast.error(errorMsg);
      set({ loading: false, error: errorMsg });
      return false;
    }
  },

  repayOrder: async (orderId) => {
    set({ loading: true });
    const token = useAuthStore.getState().token;
    try {
      const response = await apiCall.post(
        "/api/payment/create-transaction",
        { orderId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const transactionToken = response.data.data.transactionToken;
      set({ loading: false });
      return { success: true, token: transactionToken };
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to create payment transaction.";
      toast.error(errorMsg);
      set({ loading: false, error: errorMsg });
      return { success: false };
    }
  },
  get: () => get(),
}));
