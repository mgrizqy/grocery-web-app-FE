import { create } from "zustand";
import { ShippingOption, PaymentMethod } from "@/components/types";

interface CheckoutState {
  selectedAddressId: number | null;
  selectedShipping: ShippingOption | null;
  selectedPaymentMethod: PaymentMethod | null;
  isShippingModalOpen: boolean;
  isPaymentDrawerOpen: boolean;
  isAddAddressModalOpen: boolean;

  setSelectedAddressId: (id: number | null) => void;
  setSelectedShipping: (option: ShippingOption | null) => void;
  setSelectedPaymentMethod: (method: PaymentMethod | null) => void;
  setIsShippingModalOpen: (isOpen: boolean) => void;
  setIsPaymentDrawerOpen: (isOpen: boolean) => void;
  setIsAddAddressModalOpen: (isOpen: boolean) => void;

  resetCheckoutState: () => void;
}

const initialState = {
  selectedAddressId: null,
  selectedShipping: null,
  selectedPaymentMethod: {
    id: "manual_transfer",
    name: "Manual Bank Transfer",
    description: "Pay via ATM or mobile banking.",
  },
  isShippingModalOpen: false,
  isPaymentDrawerOpen: false,
  isAddAddressModalOpen: false,
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  ...initialState,

  setSelectedAddressId: (id) => set({ selectedAddressId: id }),
  setSelectedShipping: (option) => set({ selectedShipping: option }),
  setSelectedPaymentMethod: (method) => set({ selectedPaymentMethod: method }),
  setIsShippingModalOpen: (isOpen) => set({ isShippingModalOpen: isOpen }),
  setIsPaymentDrawerOpen: (isOpen) => set({ isPaymentDrawerOpen: isOpen }),
  setIsAddAddressModalOpen: (isOpen) => set({ isAddAddressModalOpen: isOpen }),

  resetCheckoutState: () => set(initialState),
}));
