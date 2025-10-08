import Image from "next/image";
import QuantityIncrementer from "./QuantityIncrementer";
import RemoveButton from "./RemoveButton";
import { formatIDRCurrency } from "@/utils/format";
import { CartItemComponentProps } from "../types";
import { Badge } from "@/components/ui/badge";

export default function CartItem({
  id,
  name,
  description,
  price,
  image,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
  isFree,
  originalPrice,
}: CartItemComponentProps) {
  return (
    <div className="py-3 sm:py-4 border-b border-gray-200 last:border-none">
      <div className="flex flex-row gap-3 sm:gap-4 lg:gap-6">
        <div className="flex-shrink-0">
          <Image
            src={image}
            alt={name}
            width={112}
            height={112}
            className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-cover rounded-xl"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-text-dark leading-tight truncate">
                  {name}
                </h3>
                {isFree && (
                  <Badge className="bg-primary-green-100 text-primary-green-700">
                    Free
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5 sm:mt-1 truncate">
                {description}
              </p>
            </div>
            <p
              className={`font-bold text-sm sm:text-base lg:text-lg text-text-dark whitespace-nowrap flex-shrink-0 ${
                isFree ? "line-through text-gray-500" : ""
              }`}
            >
              {formatIDRCurrency(Number(isFree ? originalPrice : price))}
            </p>
          </div>

          <div className="flex items-center justify-between mt-2 sm:mt-3 lg:mt-4">
            <QuantityIncrementer
              id={id as number}
              quantity={quantity}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              isFree={isFree}
            />
            {!isFree && <RemoveButton id={id as number} onRemove={onRemove} />}
            {isFree && <div />}
          </div>
        </div>
      </div>
    </div>
  );
}
