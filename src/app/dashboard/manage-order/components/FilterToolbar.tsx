"use client";

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
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { IStoreProps } from "@/types/store";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface FilterToolbarProps {
  localSearch: string;
  setLocalSearch: (value: string) => void;
  localStatus: string;
  setLocalStatus: (value: string) => void;
  localDateRange: DateRange;
  setLocalDateRange: (range: DateRange) => void;
  localStoreId: string;
  setLocalStoreId: (value: string) => void;
  stores: IStoreProps[];
  userRole: string | undefined;
  handleApplyFilters: () => void;
  handleResetFilters: () => void;
}

export default function FilterToolbar({
  localSearch,
  setLocalSearch,
  localStatus,
  setLocalStatus,
  localDateRange,
  setLocalDateRange,
  localStoreId,
  setLocalStoreId,
  stores,
  userRole,
  handleApplyFilters,
  handleResetFilters,
}: FilterToolbarProps) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg shadow-gray-200/50">
      <div className="flex flex-col md:flex-row md:flex-wrap md:items-end md:gap-4">
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="search" className="text-xs font-semibold">
            Search by Order ID / Customer
          </Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="search"
              placeholder="e.g. 123 or John Doe"
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
              <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {userRole === "SUPER_ADMIN" && (
          <div className="mt-4 md:mt-0">
            <Label htmlFor="store" className="text-xs font-semibold">
              Store
            </Label>
            <Select value={localStoreId} onValueChange={setLocalStoreId}>
              <SelectTrigger id="store" className="mt-1 w-full md:w-48">
                <SelectValue placeholder="Filter by store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
  );
}