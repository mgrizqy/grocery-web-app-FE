import { z } from "zod";

export const updateStoreSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1),
  city_id: z.string().min(1), // pastikan ini ada
  province: z.string().min(1),
  province_id: z.string().min(1), // dan ini juga
  latitude: z.number(),
  longitude: z.number(),
  is_active: z.boolean().optional(), // optional karena ditangani terpisah
});

export type UpdateStoreSchema = z.infer<typeof updateStoreSchema>;