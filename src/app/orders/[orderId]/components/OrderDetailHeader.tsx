import Link from "next/link";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import StepIndicator from "@/components/cart/StepIndicator";
import { OrderDetail } from "@/components/types";
import { ArrowLeft } from "lucide-react";
import { FiCheckCircle } from "react-icons/fi";

interface OrderDetailHeaderProps {
  order: OrderDetail;
  cameFromCheckout: boolean;
}

const confirmationStep = [
  {
    id: "confirmation",
    label: "Order Confirmation",
    icon: <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
  },
];

export default function OrderDetailHeader({
  order,
  cameFromCheckout,
}: OrderDetailHeaderProps) {
  return (
    <>
      {cameFromCheckout && (
        <div className="mb-6 space-y-4">
          <StepIndicator
            steps={confirmationStep}
            currentStep={0}
            variant="timeline"
          />
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {!cameFromCheckout && (
            <Button asChild variant="outline" size="icon" className="flex-shrink-0">
              <Link href="/orders" aria-label="Back to My Orders">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Order Details
            </h1>
            <p className="text-sm text-gray-500">
              Order #{order.id} &bull;{" "}
              {new Date(order.createdAt).toLocaleString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>
    </>
  );
}