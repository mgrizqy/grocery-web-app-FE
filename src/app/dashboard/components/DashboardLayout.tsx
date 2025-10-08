"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import CustomSidebarTrigger from "./CustomSidebarTrigger";
import DashboardNavbar from "./DashboardNavbar";
import MobileNavbarDashboard from "./MobileNavbarDashboard";
import DashboardProtection from "@/components/DashboardProtection";
import ClientWrapper from "@/app/client-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openSidebar, setOpenSidebar] = useState(true);
  return (
    <ClientWrapper>
      <DashboardProtection>
        <section className="bg-green-100/40 flex flex-col h-full max-sm:pb-10">
          {/* Header */}
          <header className="">
            <DashboardNavbar />
            <MobileNavbarDashboard className="md:hidden" />
          </header>
          {/* Sidebar and Content */}
          <SidebarProvider
            open={openSidebar}
            onOpenChange={() => setOpenSidebar((prev) => !prev)}
          >
            <AppSidebar className="" />
            <main className=" flex flex-col md:px-5  w-full overflow-y-auto ">
              <div id="sidebartrigger" className=" flex items-center">
                <CustomSidebarTrigger />
              </div>

              <div className="p-2  w-full h-[90vh]">{children}</div>
            </main>
          </SidebarProvider>
          {/* Footer */}
          <footer className=" w-full p-10  bg-white/70 border-t border-sky_blue-700/10 flex items-center justify-center">
            <p className="text-center font-poppins text-sm text-prussian-blue/50">
              &copy; 2025 My Grocery Store. All Rights Reserved
            </p>
          </footer>
        </section>
      </DashboardProtection>
    </ClientWrapper>
  );
}
