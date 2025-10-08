import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { AdminOrderDetail } from "@/components/types";
import { formatIDRCurrency } from "@/utils/format";

interface PaymentPricingCardProps {
  payment: AdminOrderDetail["payment"];
  pricing: AdminOrderDetail["pricing"];
}

export default function PaymentPricingCard({
  payment,
  pricing,
}: PaymentPricingCardProps) {
  return (
    <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
      <CardHeader className="flex flex-row items-center gap-3">
        <CreditCard className="w-5 h-5 text-gray-500" />
        <CardTitle className="text-lg">Payment & Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span className="font-medium">
            {formatIDRCurrency(Number(pricing.subtotal))}
          </span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Shipping</span>
          <span className="font-medium">
            {formatIDRCurrency(Number(pricing.cost))}
          </span>
        </div>
        {Number(pricing.discount) > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="font-medium">
              - {formatIDRCurrency(Number(pricing.discount))}
            </span>
          </div>
        )}
        <div className="border-t border-dashed border-gray-200 pt-2"></div>
        <div className="flex justify-between text-base font-bold text-gray-800">
          <span>Total</span>
          <span aria-live="polite">
            {formatIDRCurrency(Number(pricing.total))}
          </span>
        </div>
        <div className="border-t border-dashed border-gray-200 pt-3 mt-3"></div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Method</span>
            <span className="font-medium">{payment.method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="font-medium capitalize">
              {payment.status.toLowerCase()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}