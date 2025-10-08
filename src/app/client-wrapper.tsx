"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import LoadingScreen from "@/components/LoadingScreen";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hydrate, isHydrated } = useStoreWithEqualityFn(
    useAuthStore,
    (state) => ({
      hydrate: state.hydrate,
      isHydrated: state.isHydrated,
    }),
    shallow
  );

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
