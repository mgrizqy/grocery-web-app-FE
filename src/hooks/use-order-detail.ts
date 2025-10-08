"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useOrderDetailStore } from "@/store/order-detail-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "react-toastify";

export function useOrderDetail() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = Number(params.orderId);

  const {
    order,
    loading,
    error,
    fetchOrder,
    cancelOrder,
    confirmReceipt,
    repayOrder,
    get,
  } = useOrderDetailStore();
  const { token, user } = useAuthStore();

  const cameFromCheckout = searchParams.get("from") === "checkout";
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "address" | "password"
  >("profile");

  useEffect(() => {
    if (!token) {
      toast.warn("You must be logged in to view this page.");
      router.replace("/login");
      return;
    }
    if (!user?.is_verified) {
      toast.warn("Please verify your email to view your orders.");
      router.replace("/");
      return;
    }
    if (orderId && !isNaN(orderId)) {
      fetchOrder(orderId);
    } else {
      toast.error("Invalid Order ID.");
      router.replace("/profile/orders");
    }
  }, [token, user, orderId, router, fetchOrder]);

  // Polling for status update after payment gateway checkout
  useEffect(() => {
    const paymentStatus = searchParams.get("status");

    if (
      cameFromCheckout &&
      paymentStatus === "pending" && // Only poll if Midtrans indicated a pending/successful transaction
      order &&
      order.status === "PENDING_PAYMENT" &&
      order.payment?.method === "Payment Gateway"
    ) {
      let attempts = 0;
      const maxAttempts = 10; // 10 attempts * 3 seconds = 30 seconds total

      const interval = setInterval(() => {
        attempts++;
        if (
          get().order?.status !== "PENDING_PAYMENT" ||
          attempts >= maxAttempts
        ) {
          clearInterval(interval);
          return;
        }
        fetchOrder(order.id);
      }, 3000); // Poll every 3 seconds

      return () => clearInterval(interval);
    }
  }, [cameFromCheckout, order, fetchOrder, searchParams]);

  const handlePayNow = async () => {
    if (!order) return;
    const result = await repayOrder(order.id);
    if (result.success && result.token) {
      window.snap.pay(result.token, {
        onSuccess: () => {
          toast.success("Payment successful!");
          fetchOrder(order.id);
        },
        onPending: () => {
          toast.info("Your payment is pending.");
          fetchOrder(order.id);
        },
        onError: () => toast.error("Payment failed. Please try again."),
      });
    }
  };

  const handleConfirmReceipt = async () => {
    if (!order) return;
    await confirmReceipt(order.id);
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    await cancelOrder(order.id);
  };

  return {
    order,
    loading,
    error,
    cameFromCheckout,
    isCancelAlertOpen,
    activeTab,
    setActiveTab,
    setIsCancelAlertOpen,
    handleCancelOrder,
    handleConfirmReceipt,
    handlePayNow,
  };
}