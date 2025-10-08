// ==========================================================
// New File: MapPortal.tsx
// Path: src/components/MapPortal.tsx
// Stack: frontend
// ==========================================================
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function MapPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Note: We don't return a cleanup function to unmount the portal root itself,
    // as it's intended to persist for the app's lifetime.
  }, []);

  if (!mounted) {
    return null;
  }

  const portalRoot = document.getElementById("map-portal-root");
  if (!portalRoot) {
    // This case should ideally not happen if layout.tsx is correct.
    console.error("Map portal root not found in the document.");
    return null;
  }

  return createPortal(children, portalRoot);
}
