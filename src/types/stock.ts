export interface IStockProps {
  id: number;
  stock_quantity: number;
  min_stock: number;
  updated_at: Date;
  created_at: Date;
  store: { id: number; name: string };
  product: { id: number; name: string; is_active: boolean };
}

export interface IStockHistory {
  id: number;
  type: string;
  quantity: number;
  prev_stock: number;
  updated_stock: number;
  min_stock: number;
  reason: string;
  created_at: Date;
  created_by: { first_name: string; last_name: string };
  created_by_name: string;
  productStock: { store: { name: string }; product: { name: string } };
}
