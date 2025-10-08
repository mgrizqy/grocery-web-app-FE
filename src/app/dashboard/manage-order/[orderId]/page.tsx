import { use } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import AdminOrderDetailClient from "./components/AdminOrderDetailClient";

// type AdminOrderDetailPageProps = {
//   params: {
//     orderId: string;
//   };
// };

// export default async function AdminOrderDetailPage({ params }: PageProps) {
//   const orderId = parseInt(params.orderId, 10);

//   return (
//     <DashboardLayout>
//       <AdminOrderDetailClient orderId={orderId} />
//     </DashboardLayout>
//   );
// }
// interface AdminOrderDetailPageProps {
//   params: { orderId: string };
//   // searchParams?: Record<string, string | string[] | undefined>;
// }

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  // const orderId = parseInt(params.orderId, 10);
  const { orderId } = await params;

  const idNum = parseInt(orderId, 10);

  return (
    <DashboardLayout>
      <AdminOrderDetailClient orderId={idNum} />
    </DashboardLayout>
  );
}
