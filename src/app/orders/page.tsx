"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useOrderListStore } from "@/store/order-list-store";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  AlertCircle,
  ClipboardList,
  Loader2,
  Package,
  Calendar as CalendarIcon,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import PaginationControls from "@/components/PaginationControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DatePicker from "@/components/DatePicker";
import OrderCard from "./OrderCard";

const OrderListPage = () => {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const {
    orders,
    pagination,
    loading,
    error,
    fetchOrders,
    filters,
    setFilters,
  } = useOrderListStore();

  const [localSearch, setLocalSearch] = useState(filters.searchTerm);
  const [localStatus, setLocalStatus] = useState(filters.statusFilter);
  const [localDateRange, setLocalDateRange] = useState(filters.dateRange);
  const [isClient, setIsClient] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    if (!token) {
      toast.warn("Please log in to view your orders.");
      router.replace("/login");
      return;
    }

    if (!user?.is_verified) {
      toast.warn("Please verify your email to view your orders.");
      router.replace("/");
      return;
    }

    fetchOrders(1).finally(() => setCheckingAuth(false));
  }, [isClient, token, user, router, fetchOrders]);

  const handlePageChange = (page: number) => {
    fetchOrders(page);
  };

  const handleApplyFilters = () => {
    setFilters({
      searchTerm: localSearch,
      statusFilter: localStatus,
      dateRange: localDateRange,
    });
  };

  const handleResetFilters = () => {
    setLocalSearch("");
    setLocalStatus("ALL");
    setLocalDateRange({ from: undefined, to: undefined });
    setFilters({
      searchTerm: "",
      statusFilter: "ALL",
      dateRange: { from: undefined, to: undefined },
    });
  };

  const renderContent = () => {
    if (checkingAuth || (loading && orders.length === 0)) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Error loading orders
          </h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-semibold text-gray-900">
            No orders found
          </h3>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full flex-shrink-0 bg-white dark:bg-gray-800">
        <Navbar />
      </div>

      <main className="flex-1 max-w-4xl mx-auto p-4 sm:p-6 w-full">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center bg-primary-green-100 rounded-full">
              <ClipboardList className="w-5 h-5 text-primary-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              My Orders
            </h1>
          </div>

          {/* --- Filter Toolbar --- */}
          <div className="bg-white p-4 rounded-2xl shadow-lg shadow-gray-200/50">
            <div className="flex flex-col md:flex-row md:items-end md:gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-xs font-semibold">
                  Search by Order ID
                </Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="search"
                    placeholder="e.g. 123"
                    className="pl-9"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                <Label htmlFor="status" className="text-xs font-semibold">
                  Status
                </Label>
                <Select value={localStatus} onValueChange={setLocalStatus}>
                  <SelectTrigger id="status" className="mt-1 w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="PENDING_PAYMENT">
                      Pending Payment
                    </SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4 md:mt-0">
                <Label className="text-xs font-semibold">Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full md:w-64 justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localDateRange?.from ? (
                        localDateRange.to ? (
                          <>
                            {format(localDateRange.from, "LLL dd")} -{" "}
                            {format(localDateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(localDateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DatePicker
                      range={localDateRange}
                      setRange={setLocalDateRange}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <Button variant="ghost" onClick={handleResetFilters}>
                  Reset
                </Button>
                <Button onClick={handleApplyFilters}>Apply</Button>
              </div>
            </div>
          </div>

          {renderContent()}

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
      </main>
      <div className="w-full flex-shrink-0">
        <Footer />
      </div>
    </div>
  );
};

export default OrderListPage;