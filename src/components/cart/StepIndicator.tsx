"use client";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { cn } from "@/lib/utils";
import React from "react";

interface StepIndicatorProps {
  steps?: Step[];
  currentStep?: number;
  variant?: "active-only" | "timeline";
}

interface Step {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function StepIndicator({
  steps = [
    {
      id: "cart",
      label: "Shopping Cart",
      icon: <AiOutlineShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
  ],
  currentStep = 0,
  variant = "timeline",
}: StepIndicatorProps) {
  if (variant === "active-only") {
    const step = steps[currentStep];
    return (
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 border-primary-green-600 bg-primary-green-600 shadow-lg">
            <div className="text-white">{step.icon}</div>
          </div>
          <span className="text-base sm:text-lg font-semibold text-text-dark">
            {step.label}
          </span>
        </div>
      </div>
    );
  }

  const totalColumns = steps.length + Math.max(0, steps.length - 1);

  const getAdaptiveGap = (stepCount: number) => {
    if (stepCount <= 3) return "gap-2 sm:gap-4";
    if (stepCount <= 5) return "gap-1 sm:gap-3";
    if (stepCount <= 7) return "gap-1 sm:gap-2";
    return "gap-1";
  };

  return (
    <div className="w-full">
      <div
        className={cn("grid items-center w-full", getAdaptiveGap(steps.length))}
        style={{
          gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))`,
        }}
      >
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center justify-center">
                <div
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300",
                    isActive
                      ? "bg-primary-green-600 border-primary-green-600 shadow-lg scale-110"
                      : isCompleted
                        ? "bg-primary-green-600 border-primary-green-600"
                        : "bg-white border-gray-300"
                  )}
                >
                  <div
                    className={cn(
                      isActive || isCompleted ? "text-white" : "text-gray-400",
                      "transition-colors duration-300"
                    )}
                  >
                    {step.icon}
                  </div>
                </div>

                {isActive && (
                  <span className="mt-1 sm:mt-2 text-xs font-semibold text-center text-primary-green-600 transition-all duration-300 px-1">
                    {step.label}
                  </span>
                )}
              </div>

              {!isLast && (
                <div className="flex items-center justify-center h-8 sm:h-10">
                  <div
                    className={cn(
                      "h-0.5 w-full transition-all duration-300",
                      isCompleted ? "bg-primary-green-600" : "bg-gray-300"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
