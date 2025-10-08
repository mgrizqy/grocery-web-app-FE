"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { useAddressStore } from "@/store/address-store";
import { useShippingStore } from "@/store/shipping-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "react-toastify";
import { ShippingOption, PaymentMethod } from "@/components/types";
import { processOrderPlacement } from "@/services/CheckoutService";

const MockPaymentMethods: PaymentMethod[] = [
  {
    id: "manual_transfer",
    name: "Manual Bank Transfer",
    description: "Pay via ATM or mobile banking.",
  },
  {
    id: "payment_gateway",
    name: "Payment Gateway",
    description: "Credit/Debit Card, Virtual Account, etc.",
  },
];

export function useCheckout() {
  const router = useRouter();
  const { placeOrder, getMidtransToken } = useOrderStore();
  const [isProcessing, setIsProcessing] = useState(false); // Local state for UX flow

  const {
    addresses,
    loading: addressesLoading,
    fetchAddress,
  } = useAddressStore();
  const {
    fetchOptions,
    options: shippingOptions,
    loading: shippingLoading,
  } = useShippingStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(MockPaymentMethods[0]);

  const {
    items,
    appliedPromo,
    storeName,
    storeId,
    tryApplyPromoCode,
    removePromoCode,
  } = useCartStore();
  const { token, user } = useAuthStore();

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.warn("You must be logged in to view the checkout page.");
      router.replace("/login");
      return;
    }
    if (!user?.is_verified) {
      toast.warn("Please verify your email to proceed to checkout.");
      router.replace("/");
      return;
    }
    fetchAddress().then(() => setCheckingAuth(false));
  }, [token, user, router, fetchAddress]);

  useEffect(() => {
    if (!checkingAuth && selectedAddressId && storeId) {
      fetchOptions(selectedAddressId, storeId).then((options) => {
        setSelectedShipping(options && options.length > 0 ? options[0] : null);
      });
    }
  }, [checkingAuth, selectedAddressId, storeId, fetchOptions]);

  const [promoInputText, setPromoInputText] = useState(
    appliedPromo?.code || ""
  );
  const [promoStatus, setPromoStatus] = useState<"idle" | "invalid">("idle");

  useEffect(() => {
    setPromoInputText(appliedPromo?.code || "");
  }, [appliedPromo]);

  const handleApplyPromo = async () => {
    if (!(await tryApplyPromoCode(promoInputText))) {
      setPromoStatus("invalid");
    }
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setPromoInputText("");
    setPromoStatus("idle");
  };

  const handlePromoInputChange = (value: string) => {
    setPromoInputText(value);
    if (promoStatus === "invalid") setPromoStatus("idle");
  };

  const { total, shippingCost } = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
    const cost = selectedShipping?.cost || "0";
    const isFreeShipping = appliedPromo?.type === "free_shipping";
    const discountCut =
      appliedPromo &&
      appliedPromo.type !== "free_shipping" &&
      appliedPromo.type !== "b1g1"
        ? appliedPromo.type === "percentage"
          ? Math.round((subtotal * appliedPromo.value) / 100)
          : appliedPromo.value
        : 0;
    const finalShippingCost = isFreeShipping ? 0 : Number(cost);
    const totalAmount = Math.max(0, subtotal - discountCut + finalShippingCost);
    return { total: totalAmount, shippingCost: cost };
  }, [items, appliedPromo, selectedShipping]);

  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const result = await processOrderPlacement({
      selectedAddressId,
      selectedShipping,
      selectedPaymentMethod,
      storeId,
      total,
      appliedPromo,
      placeOrder,
      getMidtransToken,
    });

    if (result.success) {
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Delay for UX
      if (result.paymentMethod === "payment_gateway" && result.token) {
        window.snap.pay(result.token, {
          onSuccess: () =>
            router.push(
              `/orders/${result.orderId}?from=checkout&status=pending`
            ),
          onPending: () =>
            router.push(
              `/orders/${result.orderId}?from=checkout&status=pending`
            ),
          onError: () => {
            toast.error("Payment failed. Please try again.");
            router.push(
              `/orders/${result.orderId}?from=checkout&status=failed`
            );
          },
          onClose: () => {
            toast.warn(
              "Payment was not completed. You can find and pay for this order in your order history."
            );
            router.push(
              `/orders/${result.orderId}?from=checkout&status=failed`
            );
          },
        });
      } else {
        router.push(`/orders/${result.orderId}?from=checkout`);
      }
    } else {
      setIsProcessing(false); // Snap back on failure
    }
  };

  return {
    checkingAuth,
    isPlacingOrder: isProcessing,
    addresses,
    addressesLoading,
    selectedAddressId,
    items,
    storeName,
    selectedShipping,
    shippingOptions,
    shippingLoading,
    isModalOpen,
    isDrawerOpen,
    selectedPaymentMethod,
    appliedPromo,
    promoInputText,
    promoStatus,
    total,
    shippingCost,
    MockPaymentMethods,
    setSelectedAddressId,
    setIsModalOpen,
    setSelectedPaymentMethod,
    setIsDrawerOpen,
    setSelectedShipping,
    handlePromoInputChange,
    handleApplyPromo,
    handleRemovePromo,
    handlePlaceOrder,
  };
}