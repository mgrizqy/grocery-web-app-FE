import { apiCall } from "@/helper/apiCall";
import { IProductProps } from "@/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useLocationStore } from "./use-location-store";
import { getDistanceFromLatLonInKm } from "@/utils/distance";

type ProductStore = {
  products: IProductProps[];
  getProductList: () => Promise<void>;
  selectedProductDetails: IProductProps | null;
  setSelectedProductDetails: (product: IProductProps) => void;
  productsByLoc: IProductProps[];
  setProductsByLoc: (data: IProductProps[]) => void;
  getProductById: (id: number) => Promise<void>;
};

export const useProduct = create<ProductStore>()(
  persist(
    (set) => ({
      products: [] as IProductProps[],
      productsByLoc: [] as IProductProps[],
      selectedProductDetails: null,
      getProductList: async () => {
        try {
          const res = await apiCall.get("/api/product/all");
          set({ products: res.data.data });
        } catch (error) {
          console.log(error);
        }
      },
      setSelectedProductDetails: (product) =>
        set({ selectedProductDetails: product }),
      getProductById: async (id: number) => {
        try {
          const res = await apiCall.get(`/api/product/detail/${id}`);
          const product = res.data.data;
          const { latitude: userLat, longitude: userLong } = useLocationStore.getState();

          if (userLat && userLong && product.stocks?.length > 0) {
            product.stocks = product.stocks.map((stock: any) => {
              const storeLat = stock.store?.latitude;
              const storeLong = stock.store?.longitude;

              let distance = null;
              if (storeLat && storeLong) {
                distance = getDistanceFromLatLonInKm(userLat, userLong, storeLat, storeLong);
              }

              return {
                ...stock,
                distance,
              };
            });

            // Urutkan stok berdasarkan jarak terdekat
            product.stocks.sort((a: any, b: any) => {
              if (a.distance == null) return 1;
              if (b.distance == null) return -1;
              return a.distance - b.distance;
            });

            // Simpan jarak terdekat ke root product
            product.distance = product.stocks?.[0]?.distance || null;
          }

          // Simpan produk yang sudah diproses ke state
          set({ selectedProductDetails: product });
        } catch (err) {
          console.error("Failed to fetch product detail:", err);
        }
      },
      setProductsByLoc: (data: IProductProps[]) => set({ productsByLoc: data }),
    }),

    {
      name: "product-store",
      partialize: (state) => ({
        selectedProductDetails: state.selectedProductDetails,
        productsByLoc: state.productsByLoc,
      }),
    }
  )
);
