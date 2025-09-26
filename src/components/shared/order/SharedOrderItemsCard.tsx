import Image from "next/image";
import { SharedOrderItem } from "@/components/types";
import { formatIDRCurrency } from "@/utils/format";
import { ClipboardList } from "lucide-react";

interface SharedOrderItemsCardProps {
  items: SharedOrderItem[];
}

export default function SharedOrderItemsCard({
  items,
}: SharedOrderItemsCardProps) {
  return (
    <div className="border border-dashed border-gray-300 rounded-xl p-4">
      <ul className="space-y-4">
        {items.map((item) => (
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
        ))}
      </ul>
    </div>
  );
}