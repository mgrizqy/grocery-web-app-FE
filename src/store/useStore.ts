import { apiCall } from "@/helper/apiCall";
import { IStoreProps } from "@/types/store";
import { create } from "zustand";

interface IStoreState {
  selectedStore: string;
  setSelectedStore: (storeId: string) => void;
  storesData: IStoreProps[];
  fetchAllStores: () => void;
}

export const useStore = create<IStoreState>((set) => ({
  storesData: [],
  selectedStore: "all",
  setSelectedStore: (storeId) => set({ selectedStore: storeId }),
  fetchAllStores: async () => {
    try {
      const res = await apiCall.get("/api/store/all");
      const result = res.data.data;
      set({ storesData: result });
    } catch (error) {
      console.log(error);
    }
  },
}));
