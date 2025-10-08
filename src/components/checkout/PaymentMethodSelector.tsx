"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentMethod } from "../types";

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod | null) => void;
}

export default function PaymentMethodSelector({
  paymentMethods,
  selectedMethod,
  onSelectMethod,
}: PaymentMethodSelectorProps) {
  return (
    <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
      <CardHeader className="flex flex-row items-center gap-3 px-4 pt-4 pb-3">
        <div className="w-8 h-8 flex items-center justify-center bg-orange-100 rounded-full">
          <CreditCard className="w-4 h-4 text-orange-500" />
        </div>
        <CardTitle className="text-base sm:text-lg font-bold">
          Payment Method
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
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
                htmlFor={`pm-${method.id}`}
                className={cn(
                  "flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer",
                  selectedMethod?.id === method.id
                    ? "border-primary-green-600 bg-primary-green-50 ring-2 ring-primary-green-500/30"
                    : "border-gray-200 hover:bg-gray-50"
                )}
              >
                <RadioGroupItem value={method.id} id={`pm-${method.id}`} />
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
      </CardContent>
    </Card>
  );
}