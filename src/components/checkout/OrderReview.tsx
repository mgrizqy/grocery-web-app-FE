"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDRCurrency } from "@/utils/format";
import { CartItemProps, ShippingOption, PromoCode } from "@/components/types";
import { Badge } from "@/components/ui/badge";

interface OrderReviewProps {
  items: CartItemProps[];
  storeName: string | null;
  selectedShipping: ShippingOption | null;
  onOpenModal: () => void;
  appliedPromo: PromoCode | null;
}

export default function OrderReview({
  items,
  storeName,
  selectedShipping,
  onOpenModal,
  appliedPromo,
}: OrderReviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalItems = useMemo(() => {
    let count = 0;
    items.forEach((item) => {
      count += item.quantity;
      if (
        appliedPromo?.type === "b1g1" &&
        appliedPromo.productId === item.productId
      ) {
        count += item.quantity; // Add the free quantity
      }
    });
    return count;
  }, [items, appliedPromo]);

  return (
    <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
      <CardHeader className="px-4 pt-4 pb-3 flex flex-row justify-between items-baseline">
        <CardTitle className="text-base sm:text-lg font-bold">
          {storeName || "Your Items"}
        </CardTitle>
        <span className="text-sm font-medium text-gray-500">
          {totalItems} item{totalItems > 1 ? "s" : ""}
        </span>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="border border-dashed border-gray-300 rounded-xl p-3 space-y-3">
          {items.map((item, index) => {
            const isB1G1Item =
              appliedPromo?.type === "b1g1" &&
              appliedPromo.productId === item.productId;

            if (!isExpanded && index > 0) {
              return null;
            }

            return (
              <div key={item.id}>
                <div className="flex items-center gap-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} x {formatIDRCurrency(Number(item.price))}
                      {isB1G1Item && (
                        <Badge className="ml-2 bg-primary-green-100 text-primary-green-700">
                          +{item.quantity} Free
                        </Badge>
                      )}
                    </p>
                  </div>
                  <p className="font-semibold text-sm text-gray-800">
                    {formatIDRCurrency(item.quantity * Number(item.price))}
                  </p>
                </div>
                {isB1G1Item && isExpanded && (
                  <div className="flex items-center gap-3 mt-2 pl-3">
                    <div className="w-12 h-12" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-gray-800 truncate">
                          {item.name}
                        </p>
                        <Badge className="bg-primary-green-100 text-primary-green-700">
                          Free
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x{" "}
                        <span className="line-through">
                          {formatIDRCurrency(Number(item.price))}
                        </span>
                      </p>
                    </div>
                    <p className="font-semibold text-sm text-gray-800">
                      {formatIDRCurrency(0)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
          {items.length > 1 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-center text-sm font-semibold text-primary-green-600 pt-2 flex items-center justify-center"
            >
              {isExpanded ? "Show less" : `Show ${items.length - 1} more items`}
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>

        <button
          onClick={onOpenModal}
          className="w-full flex items-center justify-between text-left p-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <p className="font-semibold text-gray-800">Delivery Methods</p>
          <div className="flex items-center gap-2">
            {selectedShipping ? (
              <span className="text-sm font-medium text-primary-green-600">
                {selectedShipping.courier} (
                {formatIDRCurrency(Number(selectedShipping.cost))})
              </span>
            ) : (
              <span className="text-sm text-gray-500">Select</span>
            )}
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </button>
      </CardContent>
    </Card>
  );
}
