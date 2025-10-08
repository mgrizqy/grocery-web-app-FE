"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CartList from "@/components/cart/CartList";
import CheckoutSection from "@/components/cart/CheckoutSection";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { toast } from "react-toastify";

export default function CartPage() {
  const {
    items,
    appliedPromo,
    incrementItem,
    decrementItem,
    removeItem,
    tryApplyPromoCode,
    storeName,
    removePromoCode,
    saveCart,
  } = useCartStore();

  const [promoInputText, setPromoInputText] = useState(
    appliedPromo?.code || ""
  );
  const [promoStatus, setPromoStatus] = useState<"idle" | "invalid">("idle");
  const router = useRouter();

  const { token, user } = useAuthStore();
  const [isClient, setIsClient] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    if (!token) {
      toast.warn("You must be logged in to view your cart.");
      router.replace("/login");
      return;
    }

    if (!user?.is_verified) {
      toast.warn("Please verify your email to access your cart.");
      router.replace("/");
      return;
    }

    // Auth check complete — no need for checkingAuth anymore
  }, [token, user, router, isClient]);

  useEffect(() => {
    setPromoInputText(appliedPromo?.code || "");
  }, [appliedPromo]);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const debounceTimer = setTimeout(() => {
      if (token) {
        saveCart(token);
      }
    }, 1000);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [items, saveCart, token]);

  const handleApplyPromo = async () => {
    const success = await tryApplyPromoCode(promoInputText);
    if (!success) {
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
    if (promoStatus === "invalid") {
      setPromoStatus("idle");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full flex-shrink-0">
        <Navbar />
      </div>
      <main className="flex-1 bg-gray-50 p-4 sm:p-6 md:p-8 lg:p-12">
        <section className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <CartList
                items={items}
                onDecrement={decrementItem}
                onIncrement={incrementItem}
                onRemove={removeItem}
                storeName={storeName}
                appliedPromo={appliedPromo}
              />
            </div>

            <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-6 lg:h-fit">
              <CheckoutSection
                items={items}
                appliedPromo={appliedPromo}
                promoInputText={promoInputText}
                promoStatus={promoStatus}
                onApplyPromo={handleApplyPromo}
                onRemovePromo={handleRemovePromo}
                onPromoInputChange={handlePromoInputChange}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
