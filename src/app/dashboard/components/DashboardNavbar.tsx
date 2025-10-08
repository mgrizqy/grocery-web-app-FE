"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";
import { ChevronDown, Search, Store } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import DropDownProfile from "./DropDownProfile";
import { useRouter } from "next/navigation";
import PopoverNotification from "./PopoverNotifications";

export default function DashboardNavbar() {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();
  return (
    <>
      <nav className="flex justify-between items-center h-10 p-10 max-sm:px-4 bg-white ">
        <div className="flex items-center">
          {/* Logo */}
          <Image
            src="/assets/logo-long.png"
            alt="company-logo"
            width={200}
            height={200}
            className=" cursor-pointer "
            onClick={() => router.replace("/")}
          />
        </div>
        <div className=" flex items-center xl:w-1/2">
          <p className="text-2xl font-bold max-xl:hidden w-full">Dashboard</p>
          <div className="w-full relative">
            <Input
              className=" bg-white max-xl:hidden "
              placeholder="Search . . ."
            />
            <Search className="absolute top-2 right-3 size-5 max-xl:hidden text-gray-500 cursor-pointer" />
          </div>
        </div>

        <div className="flex items-center gap-x-5">
          {/* <Bell
            className="bg-gradient-to-b from-emerald-500 to-teal-600 text-white size-8 md:size-10   rounded-xl p-2 max-md:hidden "
            onClick={() => setOpenPopover((prev) => !prev)}
          /> */}
          <PopoverNotification />
          <div className="max-lg:hidden bg-gradient-to-b from-emerald-500 to-teal-600 text-white flex p-2 rounded-md gap-3 font-semibold">
            <Store />
            {user.store?.name ||
              (user.role === "SUPER_ADMIN" ? "All Stores" : "Unassigned")}
          </div>
          <div className="flex items-center justify-between gap-x-3 ">
            <div className="w-1 h-8 bg-blue-500 max-md:hidden"></div>
            <div className="flex items-center lg:gap-x-2 max-lg:bg-gray-200 max-lg:p-1 max-lg:rounded-full ">
              <div className="flex flex-col ">
                <p className="font-semibold max-lg:hidden">
                  {user.first_name} {user.last_name}
                </p>
                <p className="max-lg:hidden">
                  {user.role === "SUPER_ADMIN"
                    ? "Super Admin"
                    : user.role === "STORE_ADMIN"
                      ? "Store Admin"
                      : ""}
                </p>
              </div>
              <DropdownMenu onOpenChange={setIsDropDownOpen}>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <div className="flex items-center">
                    <Avatar className="size-11 max-sm:size-8 ">
                      <AvatarImage
                        src={user.image_url ?? "/assets/user.png"}
                        alt="@shadcn"
                      />
                      <AvatarFallback>ID</AvatarFallback>
                    </Avatar>
                    <ChevronDown
                      className={`${isDropDownOpen && "rotate-180"} transform duration-300 mx-2 cursor-pointer`}
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropDownProfile />
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
