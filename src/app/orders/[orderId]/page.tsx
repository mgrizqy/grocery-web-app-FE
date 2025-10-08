"use client";

import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ActionCenterCard from "../ActionCenterCard";
import { useOrderDetail } from "@/hooks/use-order-detail";
import { AlertCircle, ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import OrderDetailHeader from "./components/OrderDetailHeader";
import { Card, CardContent } from "@/components/ui/card";
import SharedOrderItemsCard from "@/components/shared/order/SharedOrderItemsCard";
import { ClipboardList, CreditCard } from "lucide-react";
import SharedPricingDetails from "@/components/shared/order/SharedPricingDetails";
import SharedCustomerInfoCard from "@/components/shared/order/SharedCustomerInfoCard";
import LoadingScreen from "@/components/LoadingScreen";

export default function OrderDetailPage() {
  const {
    order,
    loading,
    error,
    cameFromCheckout,
    isCancelAlertOpen,
    setIsCancelAlertOpen,
    handleCancelOrder,
    handleConfirmReceipt,
    handlePayNow,
  } = useOrderDetail();

  const formattedItems = order?.items.map((item) => ({
    id: item.id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.priceAtPurchase,
    imageUrl: item.product.imageUrl,
    isB1G1Item: item.isB1G1Item,
  }));

  const pricingInfo = order
    ? {
        isB1G1Order: order.isB1G1Order,
        items: formattedItems || [],
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        discountAmount: order.discountAmount,
        totalPrice: order.totalPrice,
        paymentMethod: order.payment?.method,
        shippingMethod: "JNE Express (Placeholder)",
      }
    : null;

  if (loading && !order) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">
          Failed to load order
        </h2>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Order Not Found</h2>
        <p className="text-gray-500">We couldn't find an order with this ID.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full flex-shrink-0 bg-white dark:bg-gray-800">
        <Navbar />
      </div>
      <main className="flex-1 max-w-4xl mx-auto p-4 sm:p-6 w-full">
        <div className="w-full space-y-6">
          <OrderDetailHeader
            order={order}
            cameFromCheckout={cameFromCheckout}
          />

          {/* Unified Card for all details */}
          <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0 p-4 sm:p-8">
            <CardContent className="p-0 space-y-6">
              <SharedCustomerInfoCard
                name={order.destinationAddress.name}
                phone={order.destinationAddress.phone}
                address={order.destinationAddress.fullAddress}
                variant="plain"
              />
              <div className="border-t border-dashed"></div>
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-gray-500" />
                  Items Ordered
                </h3>
                {formattedItems && (
                  <SharedOrderItemsCard items={formattedItems} />
                )}
              </div>
              <div className="border-t border-dashed"></div>
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  Order Information
                </h3>
                {pricingInfo && (
                  <div className="p-4 bg-white border border-gray-200 rounded-xl">
                    <SharedPricingDetails pricing={pricingInfo} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {(!cameFromCheckout ||
            (cameFromCheckout && order.status === "PENDING_PAYMENT")) && (
            <ActionCenterCard
              order={order}
              onCancel={() => setIsCancelAlertOpen(true)}
              onConfirm={handleConfirmReceipt}
              onPay={handlePayNow}
              isLoading={loading}
            />
          )}

          <div className="text-center mt-6">
            {cameFromCheckout && (
              <Link
                href="/"
                className="text-sm text-gray-500 hover:underline inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
              </Link>
            )}
          </div>
        </div>
      </main>
      <div className="w-full flex-shrink-0">
        <Footer />
      </div>

      <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel your order. This action cannot be undone and your
              items will be returned to stock.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
