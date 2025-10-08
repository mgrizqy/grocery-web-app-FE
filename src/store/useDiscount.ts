import { IDiscountProps } from "@/types/discount";
import { create } from "zustand";

interface DiscountState {
  discounts: IDiscountProps[];
  setDiscounts: (
    discounts: IDiscountProps[] | ((prev: IDiscountProps[]) => IDiscountProps[])
  ) => void;
  removeDiscount: (id: number) => void;
  addDiscount: (discount: IDiscountProps) => void;
}

export const useDiscountStore = create<DiscountState>((set) => ({
  discounts: [],
  setDiscounts: (discounts) =>
    set((state) => ({
      discounts:
        typeof discounts === "function"
          ? discounts(state.discounts)
          : discounts,
    })),
  removeDiscount: (id) =>
    set((state) => ({
      discounts: state.discounts.filter((d) => d.id !== id),
    })),
  addDiscount: (discount) =>
    set((state) => ({ discounts: [...state.discounts, discount] })),
}));
