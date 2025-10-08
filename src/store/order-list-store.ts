import { create } from "zustand";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "./auth-store";
import { toast } from "react-toastify";

interface OrderSummary {
  id: number;
  createdAt: string;
  totalPrice: string;
  status: string;
  totalItems: number;
  firstProductImage: string | null;
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
}

interface OrderListState {
  orders: OrderSummary[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  filters: Filters;
  setFilters: (newFilters: Partial<Filters>) => void;
  fetchOrders: (page?: number, limit?: number) => Promise<void>;
}

export const useOrderListStore = create<OrderListState>((set, get) => ({
  orders: [],
  pagination: null,
  loading: true,
  error: null,
  filters: {
    searchTerm: "",
    statusFilter: "ALL",
    dateRange: { from: undefined, to: undefined },
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

    const { searchTerm, statusFilter, dateRange } = get().filters;

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (searchTerm) params.append("search", searchTerm);
    if (statusFilter && statusFilter !== "ALL")
      params.append("status", statusFilter);
    if (dateRange?.from)
      params.append("startDate", dateRange.from.toISOString());
    if (dateRange?.to) params.append("endDate", dateRange.to.toISOString());

    try {
      const response = await apiCall.get(
        `/api/orders/my-orders?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { orders, pagination } = response.data.data;
      set({ orders, pagination, loading: false });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch order list.";
      toast.error(errorMsg);
      set({ error: errorMsg, loading: false });
    }
  },
}));
