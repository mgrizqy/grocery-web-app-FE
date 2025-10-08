"use client";

import { AdminOrderDetail } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2, Send, XCircle } from "lucide-react";

interface AdminActionCardProps {
  order: AdminOrderDetail;
  onConfirmPayment: () => void;
  onRejectPayment: () => void;
  onSendOrder: () => void;
  onAdminCancelOrder: () => void;
  onMarkAsRefunded: () => void;
  disabled: boolean;
}

export default function AdminActionCard({
  order,
  onConfirmPayment,
  onRejectPayment,
  onSendOrder,
  onAdminCancelOrder,
  onMarkAsRefunded,
  disabled,
}: AdminActionCardProps) {
  const renderActions = () => {
    if (disabled) {
      return (
        <div className="flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      );
    }

    if (
      order.status === "PAID" &&
      order.payment.method === "Manual Bank Transfer"
    ) {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={onConfirmPayment}
              className="bg-green-600 hover:bg-green-700 h-10 text-sm px-4"
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Confirm Payment
            </Button>
            <Button
              onClick={onRejectPayment}
              variant="destructive"
              className="h-10 text-sm px-4"
            >
              <XCircle className="w-4 h-4 mr-2" /> Reject Payment
            </Button>
          </div>
          <Button
            onClick={onAdminCancelOrder}
            variant="outline"
            className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 h-10 text-sm px-4"
          >
            <XCircle className="w-4 h-4 mr-2" /> Cancel Order
          </Button>
        </div>
      );
    }

    if (order.status === "PROCESSING") {
      return (
        <div className="space-y-3">
          <Button
            onClick={onSendOrder}
            className="w-full h-10 text-sm px-4 bg-primary-green-600 hover:bg-primary-green-700"
          >
            <Send className="w-4 h-4 mr-2" /> Mark as Shipped
          </Button>
          <Button
            onClick={onAdminCancelOrder}
            variant="outline"
            className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 h-10 text-sm px-4"
          >
            <XCircle className="w-4 h-4 mr-2" /> Cancel Order
          </Button>
        </div>
      );
    }

    if (order.status === "PAID") {
      return (
        <Button
          onClick={onAdminCancelOrder}
          variant="outline"
          className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 h-10 text-sm px-4"
        >
          <XCircle className="w-4 h-4 mr-2" /> Cancel Order
        </Button>
      );
    }

    if (order.status === "CANCELLED" && order.payment.status === "SUCCESS") {
      return (
        <Button
          onClick={onMarkAsRefunded}
          variant="secondary"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white h-10 text-sm px-4"
        >
          <CheckCircle className="w-4 h-4 mr-2" /> Mark as Refunded
        </Button>
      );
    }

    return (
      <p className="text-center text-sm text-gray-500">
        No actions available for this order status.
      </p>
    );
  };

  return (
    <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
      <CardContent className="p-4 sm:p-6">{renderActions()}</CardContent>
    </Card>
  );
}
