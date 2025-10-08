import { create } from "zustand";
import { apiCall } from "@/helper/apiCall";
import { toast } from "react-toastify";
import { AdminOrderDetail } from "@/components/types";

interface AdminOrderDetailState {
  order: AdminOrderDetail | null;
  loading: boolean;
  error: string | null;
  fetchOrder: (orderId: number) => Promise<void>;
  confirmPayment: (orderId: number) => Promise<void>;
  rejectPayment: (orderId: number) => Promise<void>;
  sendOrder: (orderId: number) => Promise<void>;
  cancelOrder: (orderId: number) => Promise<void>;
  markAsRefunded: (orderId: number) => Promise<void>;
}

export const useAdminOrderDetailStore = create<AdminOrderDetailState>(
  (set, get) => ({
    order: null,
    loading: true,
    error: null,

    fetchOrder: async (orderId) => {
      set({ loading: true, error: null });
      try {
        const res = await apiCall.get(`/api/admin/orders/${orderId}`);
        set({ order: res.data.data, loading: false });
      } catch (err: any) {
        const msg = err.response?.data?.message || "Failed to fetch order.";
        toast.error(msg);
        set({ error: msg, loading: false });
      }
    },

    confirmPayment: async (orderId) => {
      set({ loading: true });
      try {
        await apiCall.patch(`/api/admin/orders/${orderId}/confirm-payment`);
        toast.success("Payment confirmed!");
        get().fetchOrder(orderId);
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || "Failed to confirm payment."
        );
        set({ loading: false });
      }
    },

    rejectPayment: async (orderId) => {
      set({ loading: true });
      try {
        await apiCall.patch(`/api/admin/orders/${orderId}/reject-payment`);
        toast.warn("Payment rejected.");
        get().fetchOrder(orderId);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to reject payment.");
        set({ loading: false });
      }
    },

    sendOrder: async (orderId) => {
      set({ loading: true });
      try {
        await apiCall.patch(`/api/admin/orders/${orderId}/send-order`);
        toast.info("Order marked as shipped.");
        get().fetchOrder(orderId);
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || "Failed to mark as shipped."
        );
        set({ loading: false });
      }
    },

    cancelOrder: async (orderId) => {
      set({ loading: true });
      try {
        await apiCall.patch(`/api/admin/orders/${orderId}/cancel`);
        toast.error("Order has been cancelled.");
        get().fetchOrder(orderId);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to cancel order.");
        set({ loading: false });
      }
    },

    markAsRefunded: async (orderId) => {
      set({ loading: true });
      try {
        await apiCall.patch(`/api/admin/orders/${orderId}/mark-refunded`);
        toast.info("Order marked as refunded.");
        get().fetchOrder(orderId);
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || "Failed to mark as refunded."
        );
        set({ loading: false });
      }
    },
  })
);
