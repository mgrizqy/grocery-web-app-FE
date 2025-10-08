"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShippingOption } from "../types";
import { formatIDRCurrency } from "@/utils/format";
import { Loader2, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShippingMethodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shippingOptions: ShippingOption[];
  selectedOption: ShippingOption | null;
  onSelectOption: (option: ShippingOption | null) => void;
  loading?: boolean;
}

export default function ShippingMethodModal({
  open,
  onOpenChange,
  shippingOptions,
  selectedOption,
  onSelectOption,
  loading = false,
}: ShippingMethodModalProps) {
  const optionsWithId = shippingOptions.map((option) => ({
    ...option,
    id: `${option.code}-${option.service}`,
  }));

  const handleConfirm = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Delivery Method</DialogTitle>
        </DialogHeader>
        <div className="py-4 min-h-[200px] max-h-[60vh] overflow-y-auto pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-full p-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
              <p className="ml-2 text-gray-500">Finding options...</p>
            </div>
          ) : optionsWithId.length === 0 ? (
            <div className="text-center text-gray-500 p-8">
              <p>No shipping options available for this address.</p>
              <p className="text-sm">Please select another address.</p>
            </div>
          ) : (
            <RadioGroup
              value={selectedOption?.id}
              onValueChange={(value) => {
                const option = optionsWithId.find((o) => o.id === value) || null;
                onSelectOption(option);
              }}
            >
              <div className="space-y-3">
                {optionsWithId.map((option) => (
                  <Label
                    key={option.id}
                    htmlFor={`ship-${option.id}`}
                    className={cn(
                      "flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer",
                      selectedOption?.id === option.id
                        ? "border-primary-green-600 bg-primary-green-50 ring-2 ring-primary-green-500/30"
                        : "border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={`ship-${option.id}`}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-semibold text-gray-800 leading-normal">
                          {option.courier} - {option.service}
                        </p>
                        <p className="font-bold text-gray-800 leading-normal text-right">
                          {formatIDRCurrency(Number(option.cost))}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Truck className="w-4 h-4" />
                        <span>Est. arrival: {option.estimated}</span>
                      </div>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleConfirm}
            className="w-full"
            disabled={loading || optionsWithId.length === 0}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}