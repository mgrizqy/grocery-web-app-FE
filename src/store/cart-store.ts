import { apiCall } from "@/helper/apiCall";
import { PromoCode } from "@/components/types";
import { AxiosError } from "axios";
import { create } from "zustand";
import { useAuthStore } from "./auth-store";
import { toast } from "react-toastify";

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: string;
  quantity: number;
  description: string;
  image: string;
}

interface ApiCartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    stock: number;
  };
}

interface ApiCartResponse {
  store: { name: string; id: number };
  cartItems: ApiCartItem[];
  appliedPromo?: string;
}

interface ApiError {
  error: string;
}

import { useProduct } from "./useProduct";

interface CartState {
  storeId: number | null;
  storeName: string | null;
  items: CartItem[];
  stockLevels: Record<number, number>; // productId -> stock
  version: number;
  appliedPromo: PromoCode | null;
  tryApplyPromoCode: (
    code: string,
    itemsOverride?: CartItem[]
  ) => Promise<boolean>;
  loading: boolean;
  error: string | null;

  addItem: (
    product: Omit<CartItem, "quantity" | "id"> & { id: number },
    storeId: number,
    storeName: string,
    availableStock: number,
    quantity?: number
  ) => void;
  incrementItem: (cartItemId: number) => void;
  decrementItem: (cartItemId: number) => void;
  removeItem: (cartItemId: number) => void;

  removePromoCode: () => void;
  clearCart: () => void;
  resetCart: () => void;

  fetchCart: (token: string | null) => Promise<void>;
  saveCart: (token: string | null, itemsOverride?: CartItem[]) => Promise<void>;
  hydratePromo: () => void;
}

// Helper to prevent spamming the API on rapid clicks
const debounce = <F extends (...args: any[]) => any>(
  func: F,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<F>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const useCartStore = create<CartState>((set, get) => {
  const debouncedSaveAndRevalidate = debounce((itemsToProcess: CartItem[]) => {
    const { appliedPromo, saveCart, tryApplyPromoCode } = get();
    const token = useAuthStore.getState().token;
    if (token) {
      saveCart(token, itemsToProcess);
      if (appliedPromo) {
        tryApplyPromoCode(appliedPromo.code, itemsToProcess);
      }
    }
  }, 500);

  return {
    storeId: null,
    storeName: null,
    items: [],
    stockLevels: {},
    version: 0,
    appliedPromo: null,
    loading: false,
    error: null,

    addItem: (
      product: Omit<CartItem, "quantity" | "id"> & { id: number },
      storeId: number,
      storeName: string,
      availableStock: number, // This is used for the initial add
      quantity = 1
    ) => {
      const { user } = useAuthStore.getState();
      const { appliedPromo, stockLevels } = get();

      if (!user) {
        toast.error("Please log in to add items to your cart.");
        return;
      }

      if (!user.is_verified) {
        toast.warn("Please verify your email to start shopping.");
        return;
      }

      set((state) => {
        const isNewStore = state.storeId !== null && state.storeId !== storeId;
        if (isNewStore) {
          toast.info(`Cart cleared. Now shopping at ${storeName}.`);
        }
        const initialItems = isNewStore ? [] : state.items;
        const existing = initialItems.find(
          (item) => item.productId === product.id
        );
        const currentQuantityInCart = existing ? existing.quantity : 0;
        const liveStock = stockLevels[product.id] ?? availableStock;

        const isB1G1 =
          appliedPromo?.type === "b1g1" &&
          appliedPromo.productId === product.id;
        const requiredStock = isB1G1
          ? (currentQuantityInCart + quantity) * 2
          : currentQuantityInCart + quantity;

        if (requiredStock > liveStock) {
          toast.warn(
            `Not enough stock available. Only ${liveStock} units left.`
          );
          return state;
        }

        let updatedItems;
        if (existing) {
          updatedItems = initialItems.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const newItem = {
            ...product,
            id: Date.now(),
            productId: product.id,
            quantity,
          };
          updatedItems = [...initialItems, newItem];
        }

        toast.success(`${product.name} added to cart`);

        const newStockLevels = {
          ...state.stockLevels,
          [product.id]: availableStock,
        };

        const newState = {
          storeId,
          storeName,
          items: updatedItems,
          stockLevels: newStockLevels,
          appliedPromo: isNewStore ? null : state.appliedPromo,
          version: state.version + 1,
        };

        setTimeout(() => {
          const { token } = useAuthStore.getState();
          if (token) {
            get().saveCart(token);
          }
        }, 0);

        return newState;
      });
    },

    incrementItem: (cartItemId) => {
      const { items, stockLevels, appliedPromo } = get();
      const itemToIncrement = items.find((item) => item.id === cartItemId);

      if (!itemToIncrement) return;

      const liveStock = stockLevels[itemToIncrement.productId] ?? 0;

      const isB1G1 =
        appliedPromo?.type === "b1g1" &&
        appliedPromo.productId === itemToIncrement.productId;
      const requiredStock = isB1G1
        ? (itemToIncrement.quantity + 1) * 2
        : itemToIncrement.quantity + 1;

      if (requiredStock > liveStock) {
        toast.warn(
          `Not enough stock available. Only ${liveStock} total units left.`
        );
        return;
      }

      const updatedItems = get().items.map((item) =>
        item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
      );
      set((state) => ({ items: updatedItems, version: state.version + 1 }));

      debouncedSaveAndRevalidate(updatedItems);
    },

    decrementItem: (cartItemId) => {
      const updatedItems = get().items.map((item) =>
        item.id === cartItemId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      );
      set((state) => ({ items: updatedItems, version: state.version + 1 }));

      debouncedSaveAndRevalidate(updatedItems);
    },

    removeItem: (cartItemId) => {
      const updatedItems = get().items.filter((item) => item.id !== cartItemId);
      set((state) => ({ items: updatedItems, version: state.version + 1 }));

      debouncedSaveAndRevalidate(updatedItems);
    },

    tryApplyPromoCode: async (code, itemsOverride) => {
      const { storeId } = get();
      const itemsToValidate = itemsOverride || get().items;
      const subtotal = itemsToValidate.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      );

      if (!storeId) {
        toast.error("Cannot apply promo: store not selected.");
        return false;
      }

      if (!itemsOverride) {
        set({ loading: false, error: null });
      }

      try {
        const response = await apiCall.post("/api/discount/verify", {
          code,
          subtotal,
          storeId,
          items: itemsToValidate.map((item) => ({
            productId: item.productId,
            price: item.price,
            quantity: item.quantity,
          })),
        });
        const promoData: PromoCode = response.data.data;

        localStorage.setItem("applied_promo", JSON.stringify(promoData));
        set((state) => ({
          appliedPromo: promoData,

          loading: itemsOverride ? state.loading : false,
        }));

        if (!itemsOverride) {
          toast.success("Promo code applied!");
        }
        return true;
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || "Invalid promo code.";

        if (itemsOverride) {
          toast.warn(`Promo '${code}' removed: ${errorMsg}`);
        } else {
          toast.error(errorMsg);
        }

        localStorage.removeItem("applied_promo");
        set({ appliedPromo: null, loading: false, error: errorMsg });
        return false;
      }
    },

    removePromoCode: () => {
      localStorage.removeItem("applied_promo");
      set({ appliedPromo: null });
    },

    resetCart: () => {
      localStorage.removeItem("applied_promo");
      set({
        items: [],
        storeId: null,
        storeName: null,
        appliedPromo: null,
        loading: false,
        error: null,
        stockLevels: {},
        version: 0,
      });
    },

    clearCart: () => {
      localStorage.removeItem("applied_promo");
      set((state) => ({
        storeId: null,
        items: [],
        appliedPromo: null,
        version: state.version + 1,
      }));
    },

    hydratePromo: () => {
      const savedPromoJSON = localStorage.getItem("applied_promo");
      if (savedPromoJSON) {
        try {
          const savedPromo = JSON.parse(savedPromoJSON);
          set({ appliedPromo: savedPromo });
        } catch (e) {
          localStorage.removeItem("applied_promo");
          console.error(e);
        }
      }
    },

    fetchCart: async (token: string | null) => {
      if (!token) {
        set((state) => ({
          items: [],
          storeId: null,
          storeName: null,
          loading: false,
          stockLevels: {},
          version: state.version + 1,
        }));
        return;
      }
      set({ loading: true, error: null });

      try {
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };

        const response = await apiCall.get("/api/cart", authHeader);

        const data: ApiCartResponse = response.data.data;

        const newStockLevels: Record<number, number> = {};
        let cartWasAdjusted = false;

        const validatedItems = (data.cartItems || [])
          .map((item) => {
            const liveStock = item.product.stock;
            newStockLevels[item.product.id] = liveStock;
            let finalQuantity = item.quantity;
            const appliedPromo = get().appliedPromo;

            const isB1G1Item =
              appliedPromo?.type === "b1g1" &&
              appliedPromo.productId === item.product.id;

            if (isB1G1Item && item.quantity * 2 > liveStock) {
              cartWasAdjusted = true;
              finalQuantity = Math.floor(liveStock / 2);
              toast.warn(
                `B1G1 promo adjusted: Quantity for ${item.product.name} was reduced to ${finalQuantity} due to low stock.`
              );
            } else if (!isB1G1Item && item.quantity > liveStock) {
              cartWasAdjusted = true;
              finalQuantity = liveStock;
            }

            return {
              id: item.id,
              productId: item.product.id,
              name: item.product.name,
              description: item.product.description,
              price: item.product.price,
              quantity: finalQuantity,
              image: item.product.imageUrl,
            };
          })
          .filter((item) => item.quantity > 0);

        if (cartWasAdjusted && !get().appliedPromo) {
          toast.warn(
            "Some item quantities in your cart were adjusted due to low stock."
          );
        }

        if (cartWasAdjusted) {
          get().saveCart(token, validatedItems);
        }

        set((state) => ({
          storeId: data.store?.id || null,
          storeName: data.store?.name || null,
          items: validatedItems,
          stockLevels: newStockLevels,
          loading: false,
          version: state.version + 1,
        }));
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        if (error.response?.status !== 401 && error.response?.status !== 404) {
          set({
            error: error.response?.data?.error || "Failed to fetch cart",
            loading: false,
          });
        } else {
          set({
            loading: false,
            error: error.response?.data?.error || "Failed to fetch cart",
          });
        }
      }
    },

    saveCart: async (token, itemsOverride) => {
      try {
        const { storeId } = get();
        const itemsToSave = itemsOverride || get().items;

        if (!storeId) {
          console.warn("Cannot save cart without a storeId.");
          return;
        }

        const payload = {
          storeId,
          items: itemsToSave.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        };

        const authHeader = { headers: { Authorization: `Bearer ${token}` } };
        await apiCall.put("/api/cart", payload, authHeader);
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        console.error("Failed to save cart:", error.response?.data?.error);
      }
    },
  };
});
