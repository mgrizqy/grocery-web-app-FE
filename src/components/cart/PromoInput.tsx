"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PromoInputProps } from "@/components/types";

export default function PromoInput({
  inputText,
  status,
  appliedPromo,
  onInputChange,
  onApply,
  onRemove,
}: PromoInputProps) {
  const [open, setOpen] = useState(!!appliedPromo);
  const [maxHeight, setMaxHeight] = useState("0px");
  const innerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleOpen = () => setOpen((prev) => !prev);

  useEffect(() => {
    if (appliedPromo) {
      setOpen(true);
    }
  }, [appliedPromo]);

  useEffect(() => {
    if (innerRef.current) {
      if (open) {
        setMaxHeight(`${innerRef.current.scrollHeight + 10}px`);
        setTimeout(() => inputRef.current?.focus(), 150);
      } else {
        setMaxHeight("0px");
      }
    }
  }, [open, appliedPromo, status]);

  const isInvalid = status === "invalid";
  const isValidAndApplied = !!appliedPromo;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply();
  };

  return (
    <Card
      className={cn(
        "border-0 shadow-lg shadow-gray-200/50 transition-all duration-300",
        open ? "" : "pb-2"
      )}
    >
      <CardHeader
        onClick={toggleOpen}
        className="cursor-pointer flex flex-row items-center justify-between py-3 sm:py-4 px-4 sm:px-6 -mb-2"
      >
        <CardTitle className="text-sm sm:text-base font-bold text-gray-700">
          Have a promo code?
        </CardTitle>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </CardHeader>

      <CardContent
        className="transition-[max-height] duration-300 ease-in-out overflow-hidden px-4 sm:px-6"
        style={{ maxHeight }}
      >
        <div ref={innerRef}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-row sm:flex-row items-stretch sm:items-center gap-2 mx-0 my-2"
          >
            <Input
              ref={inputRef}
              placeholder="Enter promo code"
              value={inputText}
              onChange={(e) => onInputChange(e.target.value)}
              disabled={!!appliedPromo}
              onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
              className={cn(
                "h-10 text-sm rounded-lg bg-gray-100 border border-gray-200 transition-all flex-1",
                status === "invalid" &&
                  "focus-visible:border-red-700 border-red-600 bg-red-50 focus-visible:ring-red-600/30",
                isValidAndApplied &&
                  "border-green-600 bg-green-50 focus-visible:ring-green-600/20",
                !isValidAndApplied &&
                  status !== "invalid" &&
                  "focus-visible:ring-green-600/20 focus-visible:border-green-700"
              )}
            />
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={!!appliedPromo}
                className={cn(
                  "h-10 px-3 sm:px-4 text-sm sm:text-base font-semibold rounded-lg flex-shrink-0 transition-all",
                  "disabled:opacity-90 disabled:cursor-not-allowed",
                  isValidAndApplied
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-white hover:bg-gray-900"
                )}
              >
                {isValidAndApplied ? "Applied!" : "Apply"}
              </Button>
              {isValidAndApplied && (
                <Button
                  type="button"
                  onClick={onRemove}
                  variant="ghost"
                  className="h-8 w-8 sm:h-10 sm:w-10 px-2 text-sm text-gray-600 hover:text-red-600"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              )}
            </div>
          </form>

          {isInvalid && (
            <p className="mx-1 mt-1 text-xs font-medium text-red-500">
              Invalid promo code.
            </p>
          )}
          {isValidAndApplied && (
            <p className="mx-1 mt-1 text-xs font-medium text-green-600">
              Promo {appliedPromo?.code} applied successfully!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
