"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { formatShortDate, formatIDRCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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

const AdminOrderCard = ({ order }: { order: AdminOrderSummary }) => {
  return (
    <Link href={`/dashboard/manage-order/${order.id}`} className="block group">
      <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0 transition-all duration-200 hover:border-primary-green-600 hover:ring-2 hover:ring-primary-green-500/30">
        <CardContent className="p-4">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <StatusIcon status={order.status} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Order #{order.id}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatShortDate(order.createdAt)}
                  </p>
                </div>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="border-t border-dashed my-3"></div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <p className="text-xs text-gray-500">Customer</p>
                <p className="font-semibold text-gray-800 truncate">
                  {order.customerName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Store</p>
                <p className="font-semibold text-gray-800 truncate">
                  {order.storeName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-bold text-gray-900">
                  {formatIDRCurrency(Number(order.totalPrice))}
                </p>
              </div>
              <div className="flex items-end justify-end">
                <span className="text-xs font-semibold text-primary-green-700 flex items-center">
                  View Details <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] items-center gap-x-6">
            <div className="flex items-center gap-4">
              <StatusIcon status={order.status} />
              <div>
                <p className="font-bold text-gray-800">#{order.id}</p>
                <p className="text-xs text-gray-500">
                  {formatShortDate(order.createdAt)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Customer</p>
              <p className="font-semibold truncate">{order.customerName}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Store</p>
              <p className="font-semibold truncate">{order.storeName}</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="font-bold text-lg text-gray-900">
                {formatIDRCurrency(Number(order.totalPrice))}
              </p>
            </div>

            <div className="flex justify-center">
              <StatusBadge status={order.status} />
            </div>

            <div className="flex justify-center text-gray-400 group-hover:text-primary-green-600">
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
//
export default AdminOrderCard;