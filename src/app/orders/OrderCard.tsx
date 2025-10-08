"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Loader2,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { formatIDRCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface OrderSummary {
  id: number;
  createdAt: string;
  totalPrice: string;
  status: string;
  totalItems: number;
  firstProductImage: string | null;
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
      REFUNDED: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
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
      REFUNDED: {
        icon: <XCircle className="w-4 h-4" />,
        color: "text-gray-500 bg-gray-100",
      },
    }),
    []
  );

  const config =
    iconConfig[status as keyof typeof iconConfig] || iconConfig.REFUNDED;

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

const OrderCard = ({ order }: { order: OrderSummary }) => {
  return (
    <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
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

        <div className="flex items-center gap-4">
          <Image
            src={order.firstProductImage || "/fallback.png"}
            alt="Product image"
            width={64}
            height={64}
            className="w-16 h-16 object-cover rounded-lg border bg-white flex-shrink-0"
          />
          <div className="flex-1 flex gap-x-4 items-center">
            <div className="flex-shrink-0">
              <p className="font-semibold text-gray-800 text-sm">
                {order.totalItems} item{order.totalItems > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total Payment</p>
              <p className="text-base font-bold text-gray-900">
                {formatIDRCurrency(Number(order.totalPrice))}
              </p>
            </div>
            <Link
              href={`/orders/${order.id}`}
              className="flex flex-1 items-center justify-end self-stretch py-2 px-3 rounded-lg bg-gradient-to-l from-primary-green-50/80 via-primary-green-50/50 to-transparent hover:from-primary-green-100 hover:via-primary-green-100/70 transition-colors duration-200 group"
            >
              <div className="flex items-center gap-1 text-sm font-semibold text-primary-green-700">
                Details
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;