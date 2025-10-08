import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function CustomSidebarTrigger() {
  const { toggleSidebar, open } = useSidebar();
  return (
    <Button
      onClick={toggleSidebar}
      className="flex items-center gap-2 bg-transparent hover:bg-transparent shadow-none text-black max-sm:hidden cursor-pointer"
    >
      {open ? <PanelLeftClose /> : <PanelLeftOpen />}
      {/* {open ? "Close Sidebar" : "Open Sidebar"} */}
    </Button>
  );
}
