import Image from "next/image";
import { formatIDRCurrency } from "@/utils/format";
import { ClipboardList } from "lucide-react";
import { SharedOrderItem } from "@/components/types";
import React from "react";
import { Badge } from "@/components/ui/badge";

interface SharedOrderItemsCardProps {
  items: SharedOrderItem[];
}

export default function SharedOrderItemsCard({
  items,
}: SharedOrderItemsCardProps) {
  return (
    <div className="border border-dashed border-gray-300 rounded-xl p-4">
      <ul className="space-y-4">
        {items.flatMap((item) => {
          if (item.isB1G1Item) {
            const paidQty = item.quantity / 2;
            const freeQty = item.quantity / 2;
            return [
              <li key={item.id} className="flex items-center gap-4">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 object-cover rounded-lg border bg-white"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {paidQty} x {formatIDRCurrency(Number(item.price))}
                  </p>
                </div>
                <p className="font-semibold text-sm text-gray-800 text-right">
                  {formatIDRCurrency(paidQty * Number(item.price))}
                </p>
              </li>,
              <li key={`${item.id}-free`} className="flex items-center gap-4">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 object-cover rounded-lg border bg-white opacity-70"
                />
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
                    {freeQty} x{" "}
                    <span className="line-through">
                      {formatIDRCurrency(Number(item.price))}
                    </span>
                  </p>
                </div>
                <p className="font-semibold text-sm text-gray-800 text-right">
                  {formatIDRCurrency(0)}
                </p>
              </li>,
            ];
          }
          return (
            <li key={item.id} className="flex items-center gap-4">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={56}
                height={56}
                className="w-14 h-14 object-cover rounded-lg border bg-white"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.quantity} x {formatIDRCurrency(Number(item.price))}
                </p>
              </div>
              <p className="font-semibold text-sm text-gray-800 text-right">
                {formatIDRCurrency(item.quantity * Number(item.price))}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
