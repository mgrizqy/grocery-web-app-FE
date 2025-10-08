import DashboardLayout from "../components/DashboardLayout";
import OrderDashboardClient from "./components/OrderDashboardClient";

export default function ManageOrderPage() {
  return (
    <DashboardLayout>
      <OrderDashboardClient />
    </DashboardLayout>
  );
}