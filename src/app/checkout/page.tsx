"use client";

import { Loader2 } from "lucide-react";
import PaymentMethodDrawer from "@/components/checkout/PaymentMethodDrawer";
import ShippingMethodModal from "@/components/checkout/ShippingMethodModal";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSidebar from "@/components/checkout/CheckoutSidebar";
import MobileCheckoutBar from "@/components/checkout/MobileCheckoutBar";
import { useCheckout } from "@/hooks/use-checkout";

declare global {
  interface Window {
    snap: any;
  }
}

export default function CheckoutPage() {
  const {
    checkingAuth,
    isPlacingOrder,
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
  } = useCheckout();

  if (checkingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="w-full flex-shrink-0">
          <Navbar />
        </div>
        <main className="flex-1 bg-gray-50 p-4 sm:p-6 md:p-8 pb-28 lg:pb-8">
          <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
              <CheckoutForm
                addresses={addresses}
                addressesLoading={addressesLoading}
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
                items={items}
                storeName={storeName}
                selectedShipping={selectedShipping}
                onOpenModal={() => setIsModalOpen(true)}
                paymentMethods={MockPaymentMethods}
                selectedPaymentMethod={selectedPaymentMethod}
                onSelectMethod={setSelectedPaymentMethod}
                appliedPromo={appliedPromo}
              />
              <CheckoutSidebar
                items={items}
                appliedPromo={appliedPromo}
                shippingCost={shippingCost}
                promoInputText={promoInputText}
                promoStatus={promoStatus}
                handlePromoInputChange={handlePromoInputChange}
                handleApplyPromo={handleApplyPromo}
                handleRemovePromo={handleRemovePromo}
                handlePlaceOrder={handlePlaceOrder}
                total={total.toString()}
                isPlacingOrder={isPlacingOrder}
              />
            </div>
          </div>
        </main>
        <div className="hidden lg:block">
          <Footer />
        </div>
      </div>
      <MobileCheckoutBar
        setIsDrawerOpen={setIsDrawerOpen}
        handlePlaceOrder={handlePlaceOrder}
        total={total.toString()}
        isPlacingOrder={isPlacingOrder}
        items={items}
      />
      <ShippingMethodModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        shippingOptions={shippingOptions}
        loading={shippingLoading}
        selectedOption={selectedShipping}
        onSelectOption={setSelectedShipping}
      />
      <PaymentMethodDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        paymentMethods={MockPaymentMethods}
        selectedMethod={selectedPaymentMethod}
        onSelectMethod={setSelectedPaymentMethod}
      />
    </>
  );
}