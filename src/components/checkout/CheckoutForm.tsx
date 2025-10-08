"use client";

import AddressSelector from "@/components/checkout/AddressSelector";
import OrderReview from "@/components/checkout/OrderReview";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import {
  UserAddress,
  ShippingOption,
  PaymentMethod,
  CartItemProps,
  PromoCode,
} from "@/components/types";

interface CheckoutFormProps {
  addresses: UserAddress[];
  addressesLoading: boolean;
  selectedAddressId: number | null;
  setSelectedAddressId: (id: number | null) => void;
  items: CartItemProps[];
  storeName: string | null;
  selectedShipping: ShippingOption | null;
  onOpenModal: () => void;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod | null) => void;
  appliedPromo: PromoCode | null;
}

export default function CheckoutForm({
  addresses,
  addressesLoading,
  selectedAddressId,
  setSelectedAddressId,
  items,
  storeName,
  selectedShipping,
  onOpenModal,
  paymentMethods,
  selectedPaymentMethod,
  onSelectMethod,
  appliedPromo,
}: CheckoutFormProps) {
  return (
    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
        Checkout
      </h1>
      <AddressSelector
        addresses={addresses}
        loading={addressesLoading}
        selectedAddressId={selectedAddressId}
        setSelectedAddressId={setSelectedAddressId}
      />
      <OrderReview
        items={items}
        storeName={storeName}
        selectedShipping={selectedShipping}
        onOpenModal={onOpenModal}
        appliedPromo={appliedPromo}
      />
      <div className="hidden lg:block">
        <PaymentMethodSelector
          paymentMethods={paymentMethods}
          selectedMethod={selectedPaymentMethod}
          onSelectMethod={onSelectMethod}
        />
      </div>
    </div>
  );
}