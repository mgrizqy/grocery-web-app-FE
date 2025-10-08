"use client";
import { IUserProps } from "@/types/user";
import DashboardLayout from "../components/DashboardLayout";
import StoreData from "./components/StoreData";
import { useEffect, useState } from "react";
import { apiCall } from "@/helper/apiCall";
import { IStoreProps } from "@/types/store";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const [users, setUsers] = useState<IUserProps[]>([]);
  const [storeAdmins, setStoreAdmins] = useState<IStoreProps[]>([]);
  const [stores, setStores] = useState<IStoreProps[]>([]);
  const router = useRouter();

  const getUsersData = async () => {
    try {
      const res = await apiCall.get("/api/user/all");
      const data = res.data.data;
      setUsers(data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        router.push("/error/forbidden");
      } else {
        console.log(error);
        alert("Error mengambil user data");
      }
    }
  };

  const getStoreAdmins = async () => {
    try {
      const res = await apiCall.get("/api/store/store-admins");
      const data = res.data.data;
      setStoreAdmins(data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        router.push("/error/forbidden");
      } else {
        console.log(error);
        alert("Error mengambil store admins");
      }
    }
  };

  const getStoresData = async () => {
    try {
      const res = await apiCall.get("/api/store/all");
      const data = res.data.data;
      setStores(data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        router.push("/forbidden");
      } else {
        console.log(error);
        alert("Error mengambil store data");
      }
    }
  };

  useEffect(() => {
    getUsersData();
    getStoresData();
    getStoreAdmins();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 ">
        <StoreData className=" mb-8" stores={stores} />
      </div>
    </DashboardLayout>
  );
}
