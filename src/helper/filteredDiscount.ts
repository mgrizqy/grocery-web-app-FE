import { useAuthStore } from "@/store/auth-store";
import { useStore } from "@/store/useStore";
import { IDiscountProps } from "@/types/discount";

export function useFilteredDiscounts(
  discounts: IDiscountProps[],
  discountType: string,
  searchQuery: string
) {
  const { selectedStore } = useStore();
  const userRole = useAuthStore((state) => state.user.role);

  return discounts.filter((d) => {
    if (userRole === "STORE_ADMIN") {
      if (d.store_id?.toString() !== selectedStore) return false;
    } else {
      if (
        selectedStore &&
        selectedStore !== "all" &&
        d.store_id?.toString() !== selectedStore
      ) {
        return false;
      }
    }

    if (discountType !== "all" && d.type !== discountType) return false;

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const productName = d.product.name.toLowerCase();
      const code = d.code.toLowerCase();
      if (!productName.includes(q) && !code.includes(q)) return false;
    }

    return true;
  });
}
