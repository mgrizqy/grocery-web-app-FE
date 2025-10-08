import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from "lucide-react";
export default function PopoverNotification() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Bell className="bg-gradient-to-b from-emerald-500 to-teal-600 text-white size-8 md:size-10 rounded-xl p-2 max-md:hidden cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-4">
          <h4 className="font-medium leading-none">Notifikasi</h4>
          <p className="text-sm text-muted-foreground mt-2">
            Belum ada notifikasi baru untuk Anda.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
