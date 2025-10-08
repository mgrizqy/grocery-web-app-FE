import { IProductProps } from "./product";
import { IStoreProps } from "./store";
import { IUserProps } from "./user";

export interface IDiscountProps {
  id: number;
  name: string;
  product_id: number;
  store_id: number;
  code: string;
  description: string;
  type: "MANUAL" | "MIN_PURCHASE" | "B1G1";
  minPurch: number;
  minQty: number;
  freeQty: number;
  discAmount: number;
  start_date: Date;
  end_date: Date;
  createdAt: Date;
  product: IProductProps;
  store: IStoreProps;
  usage: IDiscountUsageProps[];
  creator: IUserProps;
}

export interface IDiscountUsageProps {
  id: number;
  discount_id: number;
  user_id: string;
  order_id: number;
  status: "APPLIED" | "CANCELLED";
  useAt: Date;
  // discount:IDiscountProps
}
