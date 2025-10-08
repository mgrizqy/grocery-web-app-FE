"use client";

import StepIndicator from "@/components/cart/StepIndicator";
import PaymentSummary from "@/components/checkout/PaymentSummary";
import PromoInput from "@/components/cart/PromoInput";
import CheckoutButton from "@/components/cart/CheckoutButton";
import { CartItemProps, PromoCode } from "@/components/types";
import { FiCreditCard } from "react-icons/fi";

interface CheckoutSidebarProps {
  items: CartItemProps[];
  appliedPromo: PromoCode | null;
  shippingCost: string;
  promoInputText: string;
  promoStatus: "idle" | "invalid";
  handlePromoInputChange: (value: string) => void;
  handleApplyPromo: () => void;
  handleRemovePromo: () => void;
  handlePlaceOrder: () => void;
  total: string;
  isPlacingOrder: boolean;
}

const checkoutStep = [
  {
    id: "payment",
    label: "Checkout & Payment",
    icon: <FiCreditCard className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
];

export default function CheckoutSidebar({
  items,
  appliedPromo,
  shippingCost,
  promoInputText,
  promoStatus,
  handlePromoInputChange,
  handleApplyPromo,
  handleRemovePromo,
  handlePlaceOrder,
  total,
  isPlacingOrder,
}: CheckoutSidebarProps) {
  return (
    <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-6 lg:h-fit">
      <StepIndicator steps={checkoutStep} currentStep={0} />
      <PaymentSummary
        items={items}
        appliedPromo={appliedPromo}
        shippingCost={shippingCost}
      />
      <PromoInput
        inputText={promoInputText}
        status={promoStatus}
        appliedPromo={appliedPromo}
        onInputChange={handlePromoInputChange}
        onApply={handleApplyPromo}
        onRemove={handleRemovePromo}
      />
      <div className="h-24 lg:hidden" />
      <div className="hidden lg:block">
        <CheckoutButton
          mode="checkout"
          onClick={handlePlaceOrder}
          total={total}
          isLoading={isPlacingOrder}
          disabled={items.length === 0}
        />
      </div>
    </div>
  );
}