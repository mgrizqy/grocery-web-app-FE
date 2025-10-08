"use client";
import { apiCall } from "@/helper/apiCall";
import { IStoreProps } from "@/types/store";
import { IUserProps } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import CustomerTable from "./components/CustomerTable";
import StoreAdminData from "./components/StoreAdminTable";

export default function AccountPage() {
  const router = useRouter();
  const [users, setUsers] = useState<IUserProps[]>([]);
  const [customers, setCustomers] = useState<IUserProps[]>([]);
  const [storeAdmins, setStoreAdmins] = useState<{
    withStore: IStoreProps[];
    withoutStore: IUserProps[];
  }>({
    withStore: [],
    withoutStore: [],
  });
  console.log(storeAdmins);
  const [stores, setStores] = useState<IStoreProps[]>([]);
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [usersRes, storesRes, customersRes, storeAdminsRes] =
          await Promise.all([
            apiCall.get("/api/user/all"),
            apiCall.get("/api/store/all"),
            apiCall.get("/api/user/customers"),
            apiCall.get("/api/store/store-admins"),
          ]);
        setUsers(usersRes.data.data);
        setStores(storesRes.data.data);
        setCustomers(customersRes.data.data);
        setStoreAdmins(storeAdminsRes.data.data);
      } catch (error: any) {
        if (error.response?.status === 403) {
          router.replace("/error/forbidden");
        }
        console.log("Failed to fetch data", error);
      }
    };
    fetchAllData();
  }, [router]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 ">
        <div className="flex flex-col 2xl:flex-row 2xl:justify-between gap-3">
          <CustomerTable stores={stores} className="w-full" />
          <StoreAdminData storeAdmins={storeAdmins} className="w-full" />
        </div>
      </div>
    </DashboardLayout>
  );
}
