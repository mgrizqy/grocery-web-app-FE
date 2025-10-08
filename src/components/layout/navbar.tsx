"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import {
  ShoppingCart,
  Sun,
  Moon,
  LogOut,
  Settings,
  LayoutDashboard,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { Menu, Transition } from "@headlessui/react";
import { useShallow } from "zustand/shallow";
import Image from "next/image";

const NavLinks = () => (
  <>
    {["Home", "Products", "About Us"].map((label, idx) => (
      <li key={idx}>
        <Link
          href={
            label === "Home" ? "/" : `#${label.toLowerCase().replace(" ", "")}`
          }
        >
          {label}
        </Link>
      </li>
    ))}
  </>
);

const ThemeToggle = ({ theme, setTheme }: any) => (
  <button
    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
  >
    {theme === "light" ? (
      <Moon className="w-5 h-5 text-gray-600" />
    ) : (
      <Sun className="w-5 h-5 text-yellow-400" />
    )}
  </button>
);

const CartButton = ({ totalItems }: { totalItems: number }) => (
  <Link
    href="/cart"
    className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
  >
    <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
    {totalItems > 0 && (
      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
        {totalItems > 9 ? "9+" : totalItems}
      </span>
    )}
  </Link>
);

/* ===========================
    Menu Items utk Desktop (headlessui Menu)
=========================== */
const UserMenuItems = ({ user, logout }: any) => {
  const menuLinks = [];

  if (["STORE_ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    menuLinks.push({
      href:
        user.role === "STORE_ADMIN"
          ? "/dashboard/manage-order"
          : "/dashboard/manage-store",
      icon: LayoutDashboard,
      label: "Dashboard",
    });
  }

  if (user.role === "CUSTOMER") {
    menuLinks.push({
      href: "/orders",
      icon: ShoppingCart,
      label: "Pesanan Saya",
    });
  }

  menuLinks.push(
    { href: "/pengaturan", icon: Settings, label: "Pengaturan" },
    { href: "#", icon: LogOut, label: "Logout", onClick: logout }
  );

  return menuLinks.map(({ href, icon: Icon, label, onClick }, idx) => (
    <Menu.Item key={idx}>
      {({ active }) =>
        onClick ? (
          <button
            onClick={onClick}
            className={`w-full text-left flex items-center gap-2 px-4 py-2 text-sm ${
              active ? "bg-gray-100 dark:bg-gray-700" : ""
            } text-gray-700 dark:text-gray-200`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ) : (
          <Link
            href={href}
            className={`flex items-center gap-2 px-4 py-2 text-sm ${
              active ? "bg-gray-100 dark:bg-gray-700" : ""
            } text-gray-700 dark:text-gray-200`}
          >
            <Icon className="w-4 h-4" /> {label}
          </Link>
        )
      }
    </Menu.Item>
  ));
};

/* ===========================
    Menu Items utk Mobile (plain <li>)
=========================== */
const UserMenuItemsMobile = ({ user, logout, close }: any) => {
  const menuLinks = [];

  if (["STORE_ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    menuLinks.push({
      href:
        user.role === "STORE_ADMIN"
          ? "/dashboard/manage-order"
          : "/dashboard/manage-store",
      icon: LayoutDashboard,
      label: "Dashboard",
    });
  }

  if (user.role === "CUSTOMER") {
    menuLinks.push({
      href: "/orders",
      icon: ShoppingCart,
      label: "Pesanan Saya",
    });
  }

  menuLinks.push(
    { href: "/pengaturan", icon: Settings, label: "Pengaturan" },
    { href: "#", icon: LogOut, label: "Logout", onClick: logout }
  );

  return menuLinks.map(({ href, icon: Icon, label, onClick }, idx) => (
    <li key={idx}>
      {onClick ? (
        <button
          onClick={() => {
            onClick();
            close();
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full text-left"
        >
          <Icon className="w-4 h-4" /> {label}
        </button>
      ) : (
        <Link
          href={href}
          onClick={close}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
        >
          <Icon className="w-4 h-4" /> {label}
        </Link>
      )}
    </li>
  ));
};

const MobileMenu = ({ user, logout, totalItems, close }: any) => (
  <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg md:hidden z-50">
    <ul className="flex flex-col gap-4 px-6 py-4 text-gray-600 dark:text-gray-200">
      <NavLinks />
      <hr className="border-gray-200 dark:border-gray-700" />
      <li>
        <Link href="/cart" onClick={close} className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" /> Cart
          {totalItems > 0 && (
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </Link>
      </li>
      {!user ? (
        <>
          <Link href="/login" onClick={close}>
            Login
          </Link>
          <Link
            href="/register"
            onClick={close}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold w-fit"
          >
            Register
          </Link>
        </>
      ) : (
        <UserMenuItemsMobile user={user} logout={logout} close={close} />
      )}
    </ul>
  </div>
);

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { items } = useCartStore(
    useShallow((state) => ({ items: state.items }))
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between bg-white dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <Link href={"/"}>
          <Image
            src={"/assets/logo-long.png"}
            alt={"logo"}
            width={150}
            height={150}
          />
        </Link>
      </div>

      {/* Menu utama (desktop) */}
      <ul className="hidden md:flex items-center gap-6 text-gray-600 dark:text-gray-200">
        <NavLinks />
      </ul>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {mounted && <ThemeToggle theme={theme} setTheme={setTheme} />}
        <CartButton totalItems={totalItems} />

        {!user ? (
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-600 dark:text-gray-200 hover:underline"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Register
            </Link>
          </div>
        ) : (
          <Menu as="div" className="relative hidden md:block">
            <Menu.Button className="flex items-center gap-2 focus:outline-none">
              <img
                src={user.image_url || "/assets/user.png"}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                {user.first_name} {user.last_name}
              </span>
            </Menu.Button>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  <UserMenuItems user={user} logout={logout} />
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MenuIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <MobileMenu
          user={user}
          logout={logout}
          totalItems={totalItems}
          close={() => setMobileOpen(false)}
        />
      )}
    </nav>
  );
}
