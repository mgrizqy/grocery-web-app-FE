"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatIDRCurrency } from "@/utils/format";
import { IoLockClosed } from "react-icons/io5";

interface CheckoutButtonProps {
  total: string;
  onClick: () => Promise<void> | void;
  mode: "cart" | "checkout";
  disabled?: boolean;
  isLoading?: boolean;
}

export default function CheckoutButton({
  total,
  onClick,
  mode,
  disabled = false,
  isLoading = false,
}: CheckoutButtonProps) {
  const [cartButtonState, setCartButtonState] = useState<
    "idle" | "processing" | "redirecting"
  >("idle");

  const config = useMemo(() => {
    switch (mode) {
      case "checkout":
        return {
          text: "Place Order",
          loadingText: "Processing...",
          icon: null,
          showPrice: true,
          style:
            "bg-primary-green-600 hover:bg-primary-green-700 shadow-primary-green-500/40",
        };
      case "cart":
      default:
        return {
          text: "Proceed to Checkout",
          loadingText: "Processing...",
          icon: <IoLockClosed className="text-base sm:text-lg scale-x-110" />,
          showPrice: false,
          style:
            "bg-primary-green-600 hover:bg-primary-green-700 shadow-primary-green-500/40",
        };
    }
  }, [mode]);

  const handleClick = async () => {
    if (disabled) return;

    if (mode === "cart") {
      if (cartButtonState !== "idle") return;
      try {
        setCartButtonState("processing");
        await new Promise((res) => setTimeout(res, 750));
        setCartButtonState("redirecting");
        await onClick();
      } catch (error) {
        console.error("Cart navigation failed:", error);
        setCartButtonState("idle"); // Snap back on failure
      }
    } else {
      // Checkout mode
      if (isLoading) return;
      await onClick();
    }
  };

  const showLoading = mode === "cart" ? cartButtonState !== "idle" : isLoading;
  let buttonText = config.text;
  if (mode === "cart") {
    if (cartButtonState === "processing") buttonText = config.loadingText;
    if (cartButtonState === "redirecting") buttonText = "Redirecting...";
  } else if (isLoading) {
    buttonText = config.loadingText;
  }

  return (
    <Button
      onClick={handleClick}
      disabled={showLoading || disabled}
      className={cn(
        "w-full p-6 py-7 sm:p-6 sm:py-7 rounded-xl flex items-center justify-between transform transition-all shadow-lg",
        "hover:scale-105 hover:shadow-xl active:scale-95",
        "disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed",
        showLoading
          ? "bg-gradient-to-r from-primary-green-600 to-primary-green-500 cursor-not-allowed animate-pulse-subtle disabled:opacity-100"
          : [config.style, !disabled ? "" : "bg-gray-400"],
        "text-white font-bold"
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {showLoading && (
          <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-black rounded-full animate-spin flex-shrink-0"></span>
        )}
        <span className="text-sm sm:text-lg font-sans truncate">
          {buttonText}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        {config.showPrice && (
          <span className="font-semibold">
            {formatIDRCurrency(Number(total))}
          </span>
        )}
        {config.icon}
      </div>
    </Button>
  );
}