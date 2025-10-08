import { create } from "zustand";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "./auth-store";
import { toast } from "react-toastify";

interface AdminOrderSummary {
  id: number;
  createdAt: string;
  customerName: string;
  storeName: string;
  totalPrice: string;
  totalItems: number;
  status: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface Filters {
  searchTerm: string;
  statusFilter: string;
  dateRange: DateRange;
  storeId: string;
}

interface AdminOrderState {
  orders: AdminOrderSummary[];
  pagination: PaginationInfo | null;
  summary: Record<string, number> | null;
  summaryLoading: boolean;
  loading: boolean;
  error: string | null;
  filters: Filters;
  setFilters: (newFilters: Partial<Filters>) => void;
  fetchOrders: (page?: number, limit?: number) => Promise<void>;
  fetchSummary: () => Promise<void>;
}

export const useAdminOrderStore = create<AdminOrderState>((set, get) => ({
  orders: [],
  pagination: null,
  summary: null,
  summaryLoading: true,
  loading: true,
  error: null,
  filters: {
    searchTerm: "",
    statusFilter: "ALL",
    dateRange: { from: undefined, to: undefined },
    storeId: "all",
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));

    get().fetchOrders(1);
  },

  fetchOrders: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    const token = useAuthStore.getState().token;
    if (!token) {
      return set({ loading: false, error: "Authentication required." });
    }

    const { searchTerm, statusFilter, dateRange, storeId } = get().filters;

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (searchTerm) params.append("search", searchTerm);
    if (statusFilter && statusFilter !== "ALL") {
      params.append("status", statusFilter);
    }
    if (storeId && storeId !== "all") {
      params.append("storeId", storeId);
    }
    if (dateRange?.from) {
      params.append("startDate", dateRange.from.toISOString());
    }
    if (dateRange?.to) {
      params.append("endDate", dateRange.to.toISOString());
    }

    try {
      const response = await apiCall.get(
        `/api/admin/orders?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { orders, pagination } = response.data.data;
      set({ orders, pagination, loading: false });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch admin order list.";
      toast.error(errorMsg);
      set({ error: errorMsg, loading: false });
    }
  },

  fetchSummary: async () => {
    set({ summaryLoading: true });
    const token = useAuthStore.getState().token;
    if (!token) {
      return set({ summaryLoading: false, error: "Authentication required." });
    }

    try {
      const response = await apiCall.get("/api/admin/orders/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ summary: response.data.data, summaryLoading: false });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch summary.";
      toast.error(errorMsg);
      set({ error: errorMsg, summaryLoading: false });
    }
  },
}));
