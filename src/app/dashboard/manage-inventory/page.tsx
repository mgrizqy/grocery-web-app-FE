"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { apiCall } from "@/helper/apiCall";
import InventoryHeader from "./components/InventoryHeader";
import ProductStock from "./components/PrdStockTable";
import { IStockProps } from "@/types/stock";

export default function InventoryPage() {
  // get Data
  const [stockProduct, setStockProduct] = useState<IStockProps[]>([]);
  const getProductStock = async () => {
    try {
      const res = await apiCall.get("/api/stock/all");
      //   console.log(res.data.data);
      const result = res.data.data;
      setStockProduct(result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProductStock();
  }, []);
  return (
    <DashboardLayout>
      <InventoryHeader stocks={stockProduct} />
      <ProductStock className="mt-5" stocks={stockProduct} />
    </DashboardLayout>
  );
}
