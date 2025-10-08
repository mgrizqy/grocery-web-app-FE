import { create } from "zustand";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "./auth-store";
import { useCartStore } from "./cart-store";
import { toast } from "react-toastify";

interface OrderPayload {
  addressId: number;
  storeId: number;
  shippingCost: string;
  paymentMethodId: number;
  promoCode?: string | null;
}

interface OrderState {
  loading: boolean;
  error: string | null;
  placeOrder: (
    payload: OrderPayload
  ) => Promise<{ success: boolean; orderId?: number }>;
  getMidtransToken: (orderId: number) => Promise<{
    success: boolean;
    token?: string;
  }>;
}

export const useOrderStore = create<OrderState>((set) => ({
  loading: false,
  error: null,

  placeOrder: async (payload) => {
    set({ loading: true, error: null });
    const token = useAuthStore.getState().token;

    if (!token) {
      const errorMsg = "You must be logged in to place an order.";
      toast.error(errorMsg);
      set({ loading: false, error: errorMsg });
      return { success: false };
    }

    try {
      const response = await apiCall.post("/api/orders", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      useCartStore.getState().clearCart();
      useCartStore.getState().saveCart(token);

      toast.success("Order placed successfully!");
      set({ loading: false });

      return { success: true, orderId: response.data.data.orderId };
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to place order.";
      toast.error(errorMsg);
      set({ loading: false, error: errorMsg });
      return { success: false };
    }
  },

  getMidtransToken: async (orderId) => {
    set({ loading: true, error: null });
    const token = useAuthStore.getState().token;
    if (!token) {
      const errorMsg = "Authentication required.";
      toast.error(errorMsg);
      set({ loading: false, error: errorMsg });
      return { success: false };
    }

    try {
      const response = await apiCall.post(
        "/api/payment/create-transaction",
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
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
}));
