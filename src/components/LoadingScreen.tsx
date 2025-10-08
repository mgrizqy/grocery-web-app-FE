"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="text-center max-w-sm w-full">
        <div className="relative inline-block mb-8">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-green-500 rounded-full animate-spin">
            <div className="absolute inset-2 flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl bg-gradient-to-bl from-green-600 to-emerald-500 bg-clip-text text-transparent sm:text-3xl font-bold ">
            Groceria
          </h1>
          <p className="text-base sm:text-lg text-foreground">
            Please wait for a few moments {dots}
          </p>
        </div>

        {/* <div className="mt-6 w-full max-w-xs mx-auto">
          <div className="h-1 bg-green-300 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-pulse" />
          </div>
        </div> */}
      </div>
    </div>
  );
}
