"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Loader2,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";

interface SummaryCardsProps {
  summary: Record<string, number> | null;
  loading: boolean;
}

const statusOrder = [
  "PROCESSING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "PENDING_PAYMENT",
  "CANCELLED",
  "REFUNDED",
];

export default function SummaryCards({ summary, loading }: SummaryCardsProps) {
  const summaryConfig = useMemo(
    () => ({
      PROCESSING: {
        label: "Processing",
        icon: Loader2,
        color: "border-l-blue-500 text-blue-500",
      },
      PAID: {
        label: "Awaiting Processing",
        icon: Package,
        color: "border-l-sky-500 text-sky-500",
      },
      SHIPPED: {
        label: "Shipped",
        icon: Truck,
        color: "border-l-indigo-500 text-indigo-500",
      },
      DELIVERED: {
        label: "Delivered",
        icon: CheckCircle,
        color: "border-l-green-500 text-green-500",
      },
      PENDING_PAYMENT: {
        label: "Pending Payment",
        icon: Clock,
        color: "border-l-orange-500 text-orange-500",
      },
      CANCELLED: {
        label: "Cancelled",
        icon: XCircle,
        color: "border-l-red-500 text-red-500",
      },
      REFUNDED: {
        label: "Refunded",
        icon: XCircle,
        color: "border-l-slate-500 text-slate-500",
      },
    }),
    []
  );

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
      {statusOrder.map((status) => {
        const config = summaryConfig[status as keyof typeof summaryConfig];
        if (!config) return null;

        const count = summary?.[status] ?? 0;
        const Icon = config.icon;

        return (
          <Card
            key={status}
            className={`rounded-2xl shadow-lg shadow-gray-200/50 border-0 border-l-4 ${config.color}`}
          >
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div className="text-2xl font-bold text-slate-900">
                  {count}
                </div>
                <Icon
                  className={`h-5 w-5 flex-shrink-0 ${config.color}`}
                  aria-hidden="true"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {config.label}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}