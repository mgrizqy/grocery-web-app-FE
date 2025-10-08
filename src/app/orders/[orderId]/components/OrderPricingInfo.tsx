import { OrderDetail } from "@/components/types";
import { formatIDRCurrency } from "@/utils/format";
import { CreditCard } from "lucide-react";

interface OrderPricingInfoProps {
  order: OrderDetail;
}

export default function OrderPricingInfo({ order }: OrderPricingInfoProps) {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-gray-500" />
        Order Information
      </h3>
      <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Payment Method</span>
          <span className="font-medium text-gray-700">
            {order.payment?.method || "N/A"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Shipping Method</span>
          <span className="font-medium text-gray-700">
            JNE Express (Placeholder)
          </span>
        </div>
        <div className="border-t border-dashed my-2"></div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-gray-700">
            {formatIDRCurrency(Number(order.subtotal))}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Shipping</span>
          <span className="font-medium text-gray-700">
            {formatIDRCurrency(Number(order.shippingCost))}
          </span>
        </div>
        {Number(order.discountAmount) > 0 && (
          <div className="flex justify-between text-sm text-primary-green-600">
            <span className="font-semibold">Discount</span>
            <span className="font-semibold">
              -{formatIDRCurrency(Number(order.discountAmount))}
            </span>
          </div>
        )}
        <div className="border-t border-dashed my-2"></div>
        <div className="flex justify-between items-center text-lg font-bold text-gray-800 bg-primary-green-50 p-3 rounded-lg">
          <span>Total</span>
          <span className="font-mono">
            {formatIDRCurrency(Number(order.totalPrice))}
          </span>
        </div>
      </div>
    </div>
  );
}