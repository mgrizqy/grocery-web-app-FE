import { toast } from "react-toastify";
import { ShippingOption, PaymentMethod, PromoCode } from "@/components/types";
import { useOrderStore } from "@/store/order-store";

type OrderStoreActions = Pick<
  ReturnType<typeof useOrderStore.getState>,
  "placeOrder" | "getMidtransToken"
>;

interface ProcessOrderPlacementArgs extends OrderStoreActions {
  selectedAddressId: number | null;
  selectedShipping: ShippingOption | null;
  selectedPaymentMethod: PaymentMethod | null;
  storeId: number | null;
  total: number;
  appliedPromo: PromoCode | null;
}

export const processOrderPlacement = async ({
  selectedAddressId,
  selectedShipping,
  selectedPaymentMethod,
  storeId,
  total,
  appliedPromo,
  placeOrder,
  getMidtransToken,
}: ProcessOrderPlacementArgs): Promise<{
  success: boolean;
  orderId?: number;
  token?: string;
  paymentMethod?: string;
}> => {
  if (
    !selectedAddressId ||
    !selectedShipping ||
    !selectedPaymentMethod ||
    !storeId
  ) {
    toast.error("Please ensure all selections are made.");
    return { success: false };
  }

  const paymentMethodIdMap: { [key: string]: number } = {
    manual_transfer: 1,
    payment_gateway: 2,
  };
  const paymentMethodId = paymentMethodIdMap[selectedPaymentMethod.id];
  if (!paymentMethodId) {
    toast.error("Invalid payment method.");
    return { success: false };
  }

  const orderPayload = {
    addressId: selectedAddressId,
    storeId,
    shippingCost: selectedShipping.cost,
    paymentMethodId,
    promoCode: appliedPromo?.code,
  };

  if (total === 0) {
    const orderResult = await placeOrder(orderPayload);
    if (orderResult.success && orderResult.orderId) {
      return { success: true, orderId: orderResult.orderId, paymentMethod: 'free' };
    }
    return { success: false };
  }

  const orderResult = await placeOrder(orderPayload);
  if (!orderResult.success || !orderResult.orderId) {
    return { success: false };
  }

  const newOrderId = orderResult.orderId;

  if (selectedPaymentMethod.id === "manual_transfer") {
    return { success: true, orderId: newOrderId, paymentMethod: 'manual_transfer' };
  } else if (selectedPaymentMethod.id === "payment_gateway") {
    const paymentResult = await getMidtransToken(newOrderId);
    if (paymentResult.success && paymentResult.token) {
      return { success: true, orderId: newOrderId, token: paymentResult.token, paymentMethod: 'payment_gateway' };
    }
  }
  
  return { success: false }; // Fallback for any failed payment gateway token fetch
};