"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { formatIDRCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AdminOrderSummary {
  id: number;
  createdAt: string;
  customerName: string;
  storeName: string;
  totalPrice: string;
  totalItems: number;
  status: string;
}

const StatusBadge = ({ status }: { status: string }) => {
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
    }),
    []
  );

  return (
    <Badge
      className={cn(
        "px-2.5 py-1 text-xs font-medium rounded-full border pointer-events-none",
        statusConfig[status as keyof typeof statusConfig] ||
          "bg-gray-100 text-gray-800"
      )}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
};

const StatusIcon = ({ status }: { status: string }) => {
  const iconConfig = useMemo(
    () => ({
      PENDING_PAYMENT: {
        icon: <Clock className="w-4 h-4" />,
        color: "text-orange-500 bg-orange-100",
      },
      PAID: {
        icon: <CheckCircle className="w-4 h-4" />,
        color: "text-blue-500 bg-blue-100",
      },
      PROCESSING: {
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        color: "text-blue-500 bg-blue-100",
      },
      SHIPPED: {
        icon: <Truck className="w-4 h-4" />,
        color: "text-indigo-500 bg-indigo-100",
      },
      DELIVERED: {
        icon: <CheckCircle className="w-4 h-4" />,
        color: "text-green-500 bg-green-100",
      },
      CANCELLED: {
        icon: <XCircle className="w-4 h-4" />,
        color: "text-red-500 bg-red-100",
      },
    }),
    []
  );

  const config = iconConfig[status as keyof typeof iconConfig] || {
    icon: <Clock className="w-4 h-4" />,
    color: "text-gray-500 bg-gray-100",
  };

  return (
    <div
      className={cn(
        "w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full",
        config.color
      )}
    >
      {config.icon}
    </div>
  );
};

const AdminOrderCard2 = ({ order }: { order: AdminOrderSummary }) => {
  const router = useRouter();

  return (
    <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0 transition-all hover:shadow-gray-300/60">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <StatusIcon status={order.status} />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Order #{order.id}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="border-t border-dashed my-3"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
          <div>
            <p className="text-xs text-gray-500">Customer</p>
            <p className="font-semibold">{order.customerName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Store</p>
            <p className="font-semibold">{order.storeName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Items</p>
            <p className="font-semibold">
              {order.totalItems} item{order.totalItems > 1 ? "s" : ""}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Payment</p>
            <p className="font-bold text-gray-800">
              {formatIDRCurrency(Number(order.totalPrice))}
            </p>
          </div>
        </div>

        <div className="border-t border-dashed my-3"></div>

        <Button
          className="w-full justify-center bg-gray-800 hover:bg-gray-900 text-white font-semibold"
          onClick={() => router.push(`/dashboard/manage-order/${order.id}`)}
        >
          View Details
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminOrderCard2;