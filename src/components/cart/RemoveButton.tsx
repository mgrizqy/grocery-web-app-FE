import { IoTrashOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";

interface RemoveButtonProps {
  id: number;
  onRemove: (id: number) => void;
}

export default function RemoveButton({ id, onRemove }: RemoveButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full h-8 w-8 sm:h-10 sm:w-10"
      onClick={() => onRemove(id)}
    >
      <IoTrashOutline className="text-lg sm:text-xl" />
    </Button>
  );
}
