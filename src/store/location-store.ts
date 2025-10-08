import { create } from "zustand";
import { apiCall } from "@/helper/apiCall";
import { City, Province } from "@/components/types";

interface LocationState {
  provinces: Province[];
  cities: City[];
  loadingProvinces: boolean;
  loadingCities: boolean;
  fetchProvinces: () => Promise<void>;
  fetchCities: (provinceId: string) => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  provinces: [],
  cities: [],
  loadingProvinces: false,
  loadingCities: false,

  fetchProvinces: async () => {
    set({ loadingProvinces: true });
    try {
      const response = await apiCall.get("/api/rajaongkir/provinces");
      set({ provinces: response.data, loadingProvinces: false });
    } catch (error) {
      console.error("Failed to fetch provinces:", error);
      set({ loadingProvinces: false });
    }
  },

  fetchCities: async (provinceId: string) => {
    set({ loadingCities: true, cities: [] });
    try {
      const response = await apiCall.get(
        `/api/rajaongkir/cities/${provinceId}`
      );
      set({ cities: response.data, loadingCities: false });
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      set({ loadingCities: false });
    }
  },
}));
