import { SharedPricingInfo } from "@/components/types";
import { formatIDRCurrency } from "@/utils/format";

interface SharedPricingDetailsProps {
  pricing: SharedPricingInfo;
}

export default function SharedPricingDetails({
  pricing,
}: SharedPricingDetailsProps) {
  // Recalculate B1G1 value based on the final item list
  const b1g1Item = pricing.items?.find((item) => item.isB1G1Item);
  const b1g1Value = b1g1Item
    ? (b1g1Item.quantity / 2) * Number(b1g1Item.price)
    : 0;
  
  // A regular discount is one that has a value and is NOT a B1G1 offer
  const hasRegularDiscount = Number(pricing.discountAmount) > 0;

  return (
    <div className="space-y-2">
      {pricing.paymentMethod && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Payment Method</span>
          <span className="font-medium text-gray-700">
            {pricing.paymentMethod}
          </span>
        </div>
      )}
      {pricing.paymentStatus && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Payment Status</span>
          <span className="font-medium text-gray-700 capitalize">
            {pricing.paymentStatus.toLowerCase()}
          </span>
        </div>
      )}
      {pricing.shippingMethod && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Shipping Method</span>
          <span className="font-medium text-gray-700">
            {pricing.shippingMethod}
          </span>
        </div>
      )}

      {(pricing.paymentMethod ||
        pricing.paymentStatus ||
        pricing.shippingMethod) && (
        <div className="border-t border-dashed my-2"></div>
      )}

      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Subtotal</span>
        <span className="font-medium text-gray-700">
          {formatIDRCurrency(Number(pricing.subtotal))}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Shipping</span>
        <span className="font-medium text-gray-700">
          {formatIDRCurrency(Number(pricing.shippingCost))}
        </span>
      </div>
      
      {b1g1Value > 0 && (
        <div className="flex justify-between text-sm text-primary-green-600">
          <span className="font-semibold">Free Items (B1G1)</span>
          <span className="font-semibold line-through">
            {formatIDRCurrency(b1g1Value)}
          </span>
        </div>
      )}

      {hasRegularDiscount && (
        <div className="flex justify-between text-sm text-primary-green-600">
          <span className="font-semibold">Discount</span>
          <span className="font-semibold">
            -{formatIDRCurrency(Number(pricing.discountAmount))}
          </span>
        </div>
      )}

      <div className="border-t border-dashed my-2"></div>
      <div className="flex justify-between items-center text-lg font-bold text-gray-800 bg-primary-green-50 p-3 rounded-lg">
        <span>Total</span>
        <span className="font-mono">
          {formatIDRCurrency(Number(pricing.totalPrice))}
        </span>
      </div>
    </div>
  );
}