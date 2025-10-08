"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDRCurrency } from "@/utils/format";
import { CartItemProps, PromoCode } from "../types";

interface PaymentSummaryProps {
  items: CartItemProps[];
  appliedPromo: PromoCode | null;
  shippingCost: string;
}

export default function PaymentSummary({
  items,
  appliedPromo,
  shippingCost,
}: PaymentSummaryProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  const { subtotal, discountCut, finalShippingCost, total } = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
    const isFreeShipping = appliedPromo?.type === "free_shipping";

    const discountCut =
      appliedPromo &&
      appliedPromo.type !== "free_shipping" &&
      appliedPromo.type !== "b1g1"
        ? appliedPromo.type === "percentage"
          ? Math.round((subtotal * appliedPromo.value) / 100)
          : appliedPromo.value
        : 0;

    const finalShippingCost = isFreeShipping ? 0 : Number(shippingCost);
    const total = Math.max(0, subtotal - discountCut + finalShippingCost);
    return { subtotal, discountCut, finalShippingCost, total };
  }, [items, appliedPromo, shippingCost]);

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, [items, appliedPromo, shippingCost]);

  const isFreeShipping = appliedPromo?.type === "free_shipping";
  const showShippingLine = Number(shippingCost) > 0 || isFreeShipping;

  return (
    <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
        <CardTitle className="text-base sm:text-lg font-bold">
          Payment Summary
        </CardTitle>
      </CardHeader>
      <CardContent
        className="transition-[max-height] duration-300 ease-in-out overflow-hidden px-4 sm:px-6 pb-4 sm:pb-6"
        style={{ maxHeight }}
      >
        <div ref={contentRef} className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span className="font-medium">{formatIDRCurrency(subtotal)}</span>
          </div>

          {showShippingLine && (
            <div className="flex justify-between text-gray-500">
              <span>Shipping cost</span>
              {isFreeShipping ? (
                Number(shippingCost) > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium line-through">
                      {formatIDRCurrency(Number(shippingCost))}
                    </span>
                    <span className="font-bold text-green-600">Free</span>
                  </div>
                ) : (
                  <span className="font-bold text-green-600">Free</span>
                )
              ) : (
                <span className="font-medium">
                  {formatIDRCurrency(Number(shippingCost))}
                </span>
              )}
            </div>
          )}

          {typeof discountCut === "number" && discountCut > 0 && (
            <div className="flex justify-between text-primary-green-600">
              <span className="font-semibold">Discount</span>
              <span className="font-semibold">
                - {formatIDRCurrency(discountCut)}
              </span>
            </div>
          )}

          <div className="border-t border-dashed border-gray-200 pt-2"></div>

          <div className="flex justify-between text-base font-bold text-gray-800">
            <span>Total</span>
            <span aria-live="polite">{formatIDRCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}