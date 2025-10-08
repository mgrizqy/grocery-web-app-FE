"use client";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth-store";
import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DropDownProfile() {
  const { logout } = useAuthStore();
  const router = useRouter();
  const handleLogout = () => {
    logout();
    router.replace("/");
  };
  return (
    <DropdownMenuContent className="p-1">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => router.replace("/pengaturan")}>
        <Settings />
        Settings
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleLogout}>
        <LogOut />
          Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
