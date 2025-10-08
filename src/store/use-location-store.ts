import { create } from "zustand";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  province: string | null;
  setLocation: (
    lat: number,
    lng: number,
    city?: string,
    province?: string
  ) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  city: null,
  province: null,
  setLocation: (lat, lng, city, province) =>
    set({
      latitude: lat,
      longitude: lng,
      city: city ? city : null,
      province: province ? province : null,
    }),
}));
