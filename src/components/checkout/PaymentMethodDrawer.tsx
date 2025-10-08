"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PaymentMethod } from "../types";

interface PaymentMethodDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethods: PaymentMethod[];
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod | null) => void;
}

export default function PaymentMethodDrawer({
  open,
  onOpenChange,
  paymentMethods,
  selectedMethod,
  onSelectMethod,
}: PaymentMethodDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Select Payment Method</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <RadioGroup
            value={selectedMethod?.id}
            onValueChange={(value) => {
              const method =
                paymentMethods.find((pm) => pm.id === value) || null;
              onSelectMethod(method);
            }}
          >
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <Label
                  key={method.id}
                  htmlFor={`drawer-pm-${method.id}`}
                  className={cn(
                    "flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer",
                    selectedMethod?.id === method.id
                      ? "border-primary-green-600 bg-primary-green-50 ring-2 ring-primary-green-500/30"
                      : "border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <RadioGroupItem
                    value={method.id}
                    id={`drawer-pm-${method.id}`}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{method.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {method.description}
                    </p>
                  </div>
                </Label>
              ))}
            </div>
          </RadioGroup>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Confirm</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
