import { IStoreProps } from "./store";

export interface IProductProps {
  id: number;
  name: string;
  price: number;
  distance: number;
  stocks: {
    store: IStoreProps;
    product_id: number;
    stock_quantity: number;
    min_stock: number;
  }[];
  images: {
    id: number;
    product_id: number;
    image_url: string;
  }[];
  // province: string;
  category: {
    id: number;
    category: string;
  };
  is_active: boolean;
  description: string;
}
