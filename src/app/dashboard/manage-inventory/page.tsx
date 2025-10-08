"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { apiCall } from "@/helper/apiCall";
import InventoryHeader from "./components/InventoryHeader";
import ProductStock from "./components/PrdStockTable";
import { IStockProps } from "@/types/stock";
import { IAdminStoreData } from "@/types/store";
import { useStore } from "@/store/useStore";

export default function InventoryPage() {
  const [adminStoreData, setAdminStoreData] = useState<IAdminStoreData | null>(
    null
  );
  // get Store Admin Data
  useEffect(() => {
    const jsonData = JSON.parse(localStorage.getItem("user")!);
    if (!jsonData) return;
    console.log(jsonData);
    if (jsonData.role === "STORE_ADMIN") {
      setAdminStoreData({
        role: jsonData.role,
        store_id: jsonData.store_id,
      });
      useStore.getState().setSelectedStore(jsonData.store_id.toString());
    }
  }, []);
  // get all Store List

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
      <ProductStock
        className="mt-5"
        stocks={stockProduct}
        adminStoreData={adminStoreData}
      />
    </DashboardLayout>
  );
}
