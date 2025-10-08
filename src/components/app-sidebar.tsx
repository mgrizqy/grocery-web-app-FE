import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Archive,
  BadgeDollarSign,
  BadgePercent,
  ChartLine,
  ChevronRight,
  Package,
  Store,
  UserRoundPen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

interface IAppSidebar {
  className?: string;
}

const items = [
  {
    id: 1,
    icon: <Store className="size-10" />,
    menu: "Store ",
    url: "/dashboard/manage-store",
  },
  {
    id: 8,
    icon: <UserRoundPen className="size-10" />,
    menu: "Assign Store Admin",
    url: "/dashboard/assign-store-admin",
  },
  {
    id: 2,
    icon: <BadgeDollarSign />,
    menu: "Order",
    url: "/dashboard/manage-order",
  },
  {
    id: 3,
    icon: <Package className="size-4 ml-2" />,
    menu: "Product ",
    // url: "/dashboard/manage-",
    subMenu: [
      {
        id: 1,
        subMenu: "Product List",
        url: "/dashboard/manage-product/product-list",
      },
      {
        id: 2,
        subMenu: "Create New Product",
        url: "/dashboard/manage-product/new-product",
      },
    ],
  },

  {
    id: 4,
    icon: <UserRoundPen className="size-10" />,
    menu: "Account ",
    url: "/dashboard/manage-account",
  },

  {
    id: 5,
    icon: <Archive className="size-10" />,
    menu: "Inventory ",
    url: "/dashboard/manage-inventory",
    // subMenu: [
    //   {
    //     id: 1,
    //     subMenu: "Stock List",
    //     url: "/dashboard/manage-inventory/prd-stock-list",
    //   },
    //   {
    //     id: 2,
    //     subMenu: "Stock History",
    //     url: "/dashboard/manage-inventory/prd-stock-history",
    //   },
    // ],
  },
  {
    id: 6,
    icon: <BadgePercent className="size-10" />,
    menu: "Discount ",
    url: "/dashboard/manage-discount",
  },
  {
    id: 7,
    icon: <ChartLine className="size-4 ml-2" />,
    menu: "Report and Analysis",
    subMenu: [
      {
        id: 1,
        subMenu: "Sales Report",
        url: "/dashboard/manage-reporting/sales-report",
      },
      {
        id: 2,
        subMenu: "Stock Report",
        url: "/dashboard/manage-reporting/stock-report",
      },
    ],
  },
];

export function AppSidebar({ className }: IAppSidebar) {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const { open } = useSidebar();
  const pathname = usePathname();

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <Sidebar
      collapsible="icon"
      className={`
     ${className} flex flex-col  `}
    >
      <SidebarContent className="p-3 flex-1 ">
        <SidebarGroup>
          {open && (
            <SidebarGroupLabel className="p-0 ">
              Navigation Bar
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;

                if (item.url && !item.subMenu) {
                  return (
                    <SidebarMenuItem
                      key={item.id}
                      className={`rounded-md ${
                        isActive ? "bg-muted text-primary font-medium" : ""
                      }`}
                    >
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className={`flex items-center cursor-pointer ${
                            open ? "gap-x-3 justify-start" : "justify-center"
                          }`}
                        >
                          {item.icon}
                          {open && <span>{item.menu}</span>}
                        </Link>
                      </SidebarMenuButton>
                      {open && (
                        <SidebarMenuAction>
                          <ChevronRight className="size-4 cursor-pointer" />
                        </SidebarMenuAction>
                      )}
                    </SidebarMenuItem>
                  );
                }

                // has submenu (collapsible)
                return (
                  <SidebarMenuItem
                    key={item.id}
                    className="rounded-md cursor-pointer flex "
                  >
                    <Collapsible
                      open={openItems.includes(item.id)}
                      onOpenChange={() => toggleItem(item.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <div
                          className={`flex items-center w-full ${
                            open ? "gap-x-3 justify-start" : "justify-center"
                          }`}
                        >
                          <div
                            className={`flex items-center justify-between w-full`}
                          >
                            <div className="flex items-center gap-x-3">
                              {item.icon}
                              {open && <span>{item.menu}</span>}

                              <SidebarMenuAction className="">
                                <ChevronRight
                                  className={`size-4 transition-transform duration-200 relative -top-1.5 ${
                                    openItems.includes(item.id)
                                      ? "rotate-90"
                                      : ""
                                  }`}
                                />
                              </SidebarMenuAction>
                            </div>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="">
                        <SidebarMenuSub className="">
                          {item.subMenu?.map((sub) => {
                            const isSubActive = pathname === sub.url;
                            return (
                              <SidebarMenuSubItem
                                key={sub.id}
                                className={`ml-1 my-1 rounded-md ${isSubActive && "bg-gray-200/30 font-medium"}`}
                              >
                                <SidebarMenuSubButton asChild>
                                  <Link href={sub.url}>{sub.subMenu}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
