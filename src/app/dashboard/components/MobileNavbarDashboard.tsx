"use client";
import {
  Archive,
  BadgePercent,
  ChartLine,
  Package,
  Store,
  UserRoundPen,
  UserCog, // ✅ Import icon baru
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

interface IMobileNavbar {
  className?: string;
}

const items = [
  {
    id: 1,
    icon: <Store className="size-6" />,
    url: "/dashboard/manage-store",
  },
  {
    id: 2,
    icon: <UserRoundPen className="size-6" />,
    url: "/dashboard/manage-account",
  },
  {
    id: 3,
    icon: <Package className="size-6" />,
    url: "/dashboard/manage-product/product-list",
  },
  {
    id: 4,
    icon: <Archive className="size-6" />,
    url: "/dashboard/manage-inventory",
  },
  {
    id: 5,
    icon: <BadgePercent className="size-6" />,
    url: "/dashboard/manage-discount",
  },
  {
    id: 6,
    icon: <ChartLine className="size-6" />,
    url: "/dashboard/manage-reporting/sales-report",
  },
  {
    id: 7,
    icon: <UserCog className="size-6" />,
    url: "/dashboard/assign-store-admin",
  },
];

export default function MobileNavbarDashboard({ className }: IMobileNavbar) {
  const pathname = usePathname();

  return (
    <div className={`${className} bg-white w-full h-18 fixed bottom-0 z-20 flex rounded-t-md`}>
      <ul className="flex items-center w-full justify-around mx-4">
        {items.map((item) => {
          const isActive = pathname === item.url;
          return (
            <Link href={item.url} key={item.id}>
              <motion.li
                whileTap={{ scale: 1.2 }}
                className={isActive ? "text-green-500" : "text-black"}
              >
                {item.icon}
              </motion.li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
