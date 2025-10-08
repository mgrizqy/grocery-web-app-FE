"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

export default function StoreInitializer() {
  const { token, isHydrated: isAuthHydrated } = useStoreWithEqualityFn(
    useAuthStore,
    (state) => ({
      token: state.token,
      isHydrated: state.isHydrated,
    }),
    shallow
  );
  const { hydratePromo, fetchCart } = useStoreWithEqualityFn(
    useCartStore,
    (state) => ({
      hydratePromo: state.hydratePromo,
      fetchCart: state.fetchCart,
    }),
    shallow
  );

  useEffect(() => {
    hydratePromo();
  }, [hydratePromo]);

  useEffect(() => {
    // This effect now reliably runs on initial load (after hydration) AND on login/logout.
    if (!isAuthHydrated) {
      return; // Wait for the auth store to be ready.
    }

    if (token) {
      // If a token exists after hydration, it means the user is logged in.
      // We should fetch their cart from the database.
      fetchCart(token);
    }
    // We REMOVE the `else { resetCart() }` block.
    // The cart is empty by default, so we don't need to force a reset on load.
    // The only time the cart should be reset is on an explicit logout action,
    // which is already handled in the auth-store's logout() function.
  }, [token, isAuthHydrated, fetchCart]);

  return null;
}
