"use client";

import { useMemo } from "react";
import PaymentSummary from "../checkout/PaymentSummary";
import PromoInput from "./PromoInput";
import CheckoutButton from "./CheckoutButton";
import { useRouter } from "next/navigation";
import { CheckoutSectionProps } from "../types";
import StepIndicator from "./StepIndicator";

export default function CheckoutSection({
  items,
  appliedPromo,
  promoInputText,
  promoStatus,
  onApplyPromo,
  onRemovePromo,
  onPromoInputChange,
}: CheckoutSectionProps) {
  const router = useRouter();
  const { total } = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    const discountCut = appliedPromo
      ? appliedPromo.type === "percentage"
        ? Math.round((subtotal * appliedPromo.value) / 100)
        : appliedPromo.value
      : 0;

    const total = Math.max(0, subtotal - discountCut);
    return { total };
  }, [items, appliedPromo]);

  return (
    <>
      <StepIndicator />
      <PaymentSummary
        items={items}
        appliedPromo={appliedPromo}
        shippingCost={"0"}
      />

      <PromoInput
        inputText={promoInputText}
        status={promoStatus}
        appliedPromo={appliedPromo}
        onInputChange={onPromoInputChange}
        onApply={onApplyPromo}
        onRemove={onRemovePromo}
      />
      <CheckoutButton
        mode="cart"
        onClick={() => router.push("/checkout")}
        total={total.toString()}
        disabled={items.length === 0}
      />
    </>
  );
}