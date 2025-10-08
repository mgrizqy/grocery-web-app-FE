"use client";

import { useEffect, useState } from "react";
import { useAdminOrderStore } from "@/store/admin-order-store";
import { useAuthStore } from "@/store/auth-store";
import { apiCall } from "@/helper/apiCall";
import PaginationControls from "@/components/PaginationControls";
import { AlertCircle, Calendar as Loader2 } from "lucide-react";
import { IStoreProps } from "@/types/store";
import AdminOrderCard from "./AdminOrderCard";
import SummaryCards from "./SummaryCards";
import FilterToolbar from "./FilterToolbar";

const OrderDashboardClient = () => {
  const { user } = useAuthStore();
  const {
    orders,
    pagination,
    loading,
    error,
    fetchOrders,
    filters,
    setFilters,
    summary,
    summaryLoading,
    fetchSummary,
  } = useAdminOrderStore();

  const [localSearch, setLocalSearch] = useState(filters.searchTerm);
  const [localStatus, setLocalStatus] = useState(filters.statusFilter);
  const [localDateRange, setLocalDateRange] = useState(filters.dateRange);
  const [localStoreId, setLocalStoreId] = useState(filters.storeId);
  const [stores, setStores] = useState<IStoreProps[]>([]);

  useEffect(() => {
    fetchOrders(1);
    fetchSummary();
  }, [fetchOrders, fetchSummary]);

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN") {
      const fetchStores = async () => {
        try {
          const res = await apiCall.get("/api/store/all");
          setStores(res.data.data);
        } catch (error) {
          console.error("Failed to fetch stores", error);
        }
      };
      fetchStores();
    }
  }, [user]);

  const handleApplyFilters = () => {
    setFilters({
      searchTerm: localSearch,
      statusFilter: localStatus,
      dateRange: localDateRange,
      storeId: localStoreId,
    });
  };

  const handleResetFilters = () => {
    setLocalSearch("");
    setLocalStatus("ALL");
    setLocalDateRange({ from: undefined, to: undefined });
    setLocalStoreId("all");
    setFilters({
      searchTerm: "",
      statusFilter: "ALL",
      dateRange: { from: undefined, to: undefined },
      storeId: "all",
    });
  };

  const handlePageChange = (page: number) => {
    fetchOrders(page);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Order Management</h1>

      <SummaryCards summary={summary} loading={summaryLoading} />

      <FilterToolbar
        localSearch={localSearch}
        setLocalSearch={setLocalSearch}
        localStatus={localStatus}
        setLocalStatus={setLocalStatus}
        localDateRange={localDateRange}
        setLocalDateRange={setLocalDateRange}
        localStoreId={localStoreId}
        setLocalStoreId={setLocalStoreId}
        stores={stores}
        userRole={user?.role}
        handleApplyFilters={handleApplyFilters}
        handleResetFilters={handleResetFilters}
      />

      {loading ? (
        <div className="flex justify-center items-center py-24 rounded-2xl bg-white shadow-lg shadow-gray-200/50">
          <Loader2 className="h-10 w-10 animate-spin text-primary-green-600" />
        </div>
      ) : error ? (
        <div className="text-center py-24 rounded-2xl bg-white shadow-lg shadow-gray-200/50">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Error Loading Orders
          </h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <AdminOrderCard key={order.id} order={order} />
            ))
          ) : (
            <div className="text-center py-24 rounded-2xl bg-white shadow-lg shadow-gray-200/50">
              <p className="font-semibold">No Orders Found</p>
              <p className="text-sm text-gray-500">
                No orders were found that match your criteria.
              </p>
            </div>
          )}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDashboardClient;
