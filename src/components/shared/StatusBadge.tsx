"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = useMemo(
    () => ({
      PENDING_PAYMENT:
        "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100",
      PAID: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
      PROCESSING: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
      SHIPPED:
        "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-100",
      DELIVERED:
        "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
      CANCELLED: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
      REFUNDED: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
    }),
    []
  );

  return (
    <Badge
      className={cn(
        "px-3 py-1 text-sm font-medium rounded-full border pointer-events-none capitalize",
        statusConfig[status as keyof typeof statusConfig] ||
          "bg-gray-100 text-gray-800"
      )}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
}