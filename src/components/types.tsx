export interface UserAddress {
  id: number;
  name: string;
  phone: string;
  label: string;
  province_id?: string | null;
  province: string;
  city_id?: string | null;
  city: string;
  district: string;
  subdistrict?: string | null;
  postal_code: string;
  street: string;
  detail?: string | null;
  is_primary: boolean;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Province {
  province_id: string;
  province: string;
}

export interface City {
  city_id: string;
  city_name: string;
  type: string;
  postal_code: string;
}

export interface ShippingOption {
  id: string;
  courier: string;
  service: string;
  cost: string;
  code: string;
  estimated: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
}

export interface CartItemProps {
  id: number | string; // Can be string for virtual items
  productId: number;
  name: string;
  description: string;
  price: string;
  image: string;
  quantity: number;
  isFree?: boolean;
  originalPrice?: string;
}

export interface CartItemComponentProps extends CartItemProps {
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onRemove: (id: number) => void;
  isB1G1Applied?: boolean;
}

export interface CartListProps {
  items: CartItemProps[];
  storeName?: string | null;
  appliedPromo: PromoCode | null;
  onDecrement: (id: number) => void;
  onIncrement: (id: number) => void;
  onRemove: (id: number) => void;
}

export interface PromoCode {
  code: string;
  description: string;
  type: "percentage" | "fixed" | "free_shipping" | "b1g1";
  value: number;
  productId?: number;
}

export interface CheckoutSectionProps {
  items: CartItemProps[];
  appliedPromo: PromoCode | null;
  promoInputText: string;
  promoStatus: "idle" | "invalid";
  onApplyPromo: () => void;
  onRemovePromo: () => void;
  onPromoInputChange: (value: string) => void;
}

export interface PromoInputProps {
  inputText: string;
  status: "idle" | "invalid";
  appliedPromo: PromoCode | null;
  onInputChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
}

export interface OrderItemDetail {
  id: number;
  quantity: number;
  priceAtPurchase: string;
  isB1G1Item: boolean;
  product: {
    id: number;
    name: string;
    imageUrl: string;
  };
}

export interface SharedPricingInfo {
  items: SharedOrderItem[];
  subtotal: string;
  shippingCost: string;
  discountAmount: string;
  totalPrice: string;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  shippingMethod?: string | null;
}

export interface SharedOrderItem {
  id: number;
  name: string;
  quantity: number;
  price: string;
  imageUrl: string;
  isB1G1Item?: boolean;
}

export interface OrderDetail {
  id: number;
  createdAt: string;
  totalPrice: string;
  subtotal: string;
  shippingCost: string;
  discountAmount: string;
  destinationAddress: {
    name: string;
    phone: string | null;
    fullAddress: string;
  };
  store: {
    id: number;
    name: string;
  };
  status: string;
  payment: {
    method: string;
    status: string;
  } | null;
  items: OrderItemDetail[];
  isB1G1Order?: boolean;
}

export interface AdminOrderItem {
  id: number;
  name: string;
  quantity: number;
  price: string;
  imageUrl: string;
}

export interface AdminOrderDetail {
  id: number;
  createdAt: string;
  status: string;
  customer: {
    name: string;
    email: string;
    phone: string | null;
  };
  store: {
    name: string;
  };
  shipping: {
    address: string;
  };
  payment: {
    method: string;
    status: string;
    proofUrl: string | null;
  };
  pricing: {
    subtotal: string;
    discount: string;
    cost: string;
    total: string;
  };
  items: AdminOrderItem[];
}