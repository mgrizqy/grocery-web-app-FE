import { IoRemoveOutline, IoAddOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";

interface QuantityIncrementerProps {
  id: number;
  quantity: number;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  isFree?: boolean;
}

export default function QuantityIncrementer({
  id,
  quantity,
  onIncrement,
  onDecrement,
  isFree = false,
}: QuantityIncrementerProps) {
  return (
    <div
      className={`flex items-center border rounded-lg overflow-hidden transition-all ${
        isFree
          ? "border-dashed bg-gray-50"
          : "border-gray-300 hover:border-primary-green-500 hover:ring-1 hover:ring-primary-green-500"
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="rounded-none text-gray-600 transition-colors hover:bg-primary-green-100 hover:text-primary-green-700 h-8 w-8 sm:h-10 sm:w-10"
        onClick={() => onDecrement(id)}
        disabled={isFree}
      >
        <IoRemoveOutline className="text-base sm:text-lg" />
      </Button>

      <div className="px-2 sm:px-4 font-semibold text-text-dark text-sm sm:text-base min-w-[2rem] sm:min-w-[2.5rem] text-center flex items-baseline justify-center whitespace-nowrap">
        <span>{quantity}</span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="rounded-none text-gray-600 transition-colors hover:bg-primary-green-100 hover:text-primary-green-700 h-8 w-8 sm:h-10 sm:w-10"
        onClick={() => onIncrement(id)}
        disabled={isFree}
      >
        <IoAddOutline className="text-base sm:text-lg" />
      </Button>
    </div>
  );
}
