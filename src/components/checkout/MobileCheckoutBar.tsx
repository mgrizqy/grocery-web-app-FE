"use client";

import { MoreHorizontal } from "lucide-react";
import CheckoutButton from "@/components/cart/CheckoutButton";
import { CartItemProps } from "@/components/types";

interface MobileCheckoutBarProps {
  setIsDrawerOpen: (isOpen: boolean) => void;
  handlePlaceOrder: () => void;
  total: string;
  isPlacingOrder: boolean;
  items: CartItemProps[];
}

export default function MobileCheckoutBar({
  setIsDrawerOpen,
  handlePlaceOrder,
  total,
  isPlacingOrder,
  items,
}: MobileCheckoutBarProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 pt-5 bg-white/80 backdrop-blur-sm border-t border-gray-200 space-y-3 rounded-t-2xl shadow-[0_-4px_16px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center">
        <p className="text-xs font-medium text-gray-600">
          Select Payment Method
        </p>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-7 h-7 flex items-center justify-center bg-gray-800 text-white rounded-full"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      <CheckoutButton
        mode="checkout"
        onClick={handlePlaceOrder}
        total={total}
        isLoading={isPlacingOrder}
        disabled={items.length === 0}
      />
    </div>
  );
}