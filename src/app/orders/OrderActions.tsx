"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderDetail } from "@/components/types";
import { cn } from "@/lib/utils";
import { Bolt, CreditCard, Truck, XCircle } from "lucide-react";

interface OrderActionsProps {
  order: OrderDetail;
  onCancel: () => void;
  onConfirm: () => void;
  onPay: () => void;
}

const OrderActions = ({
  order,
  onCancel,
  onConfirm,
  onPay,
}: OrderActionsProps) => {
  if (!order) return null;

  const showPayNow =
    order.status === "PENDING_PAYMENT" &&
    order.payment?.method !== "Manual Bank Transfer";
  const showCancel = order.status === "PENDING_PAYMENT";
  const showConfirm = order.status === "SHIPPED";

  const actionCount = [showPayNow, showCancel, showConfirm].filter(
    Boolean
  ).length;

  if (actionCount === 0) {
    return null;
  }

  return (
    <Card className="mt-6 rounded-2xl shadow-lg shadow-gray-200/50 border-0">
      <CardHeader className="flex flex-row items-center gap-3 px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
        <div className="w-8 h-8 flex items-center justify-center bg-primary-green-100 rounded-full">
          <Bolt className="w-4 h-4 text-primary-green-600" />
        </div>
        <CardTitle className="text-base sm:text-lg font-bold">
          Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {showPayNow && (
          <Button
            onClick={onPay}
            className={cn(
              "w-full bg-primary-green-600 hover:bg-primary-green-700",
              actionCount === 1 && "sm:col-span-2"
            )}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Pay Now
          </Button>
        )}
        {showCancel && (
          <Button
            onClick={onCancel}
            variant="destructive"
            className={cn("w-full", actionCount === 1 && "sm:col-span-2")}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel Order
          </Button>
        )}
        {showConfirm && (
          <Button
            onClick={onConfirm}
            className={cn(
              "w-full bg-primary-green-600 hover:bg-primary-green-700",
              actionCount === 1 && "sm:col-span-2"
            )}
          >
            <Truck className="w-4 h-4 mr-2" />
            Confirm Receipt
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderActions;
