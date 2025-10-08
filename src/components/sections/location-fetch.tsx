"use client";

import { getLocationInfo } from "@/helper/get-location";
import { useLocationStore } from "@/store/use-location-store";
import React, { useEffect, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

export default function LocationFetcher() {
  const { setLocation, city, province } = useLocationStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          try {
            const info = await getLocationInfo(latitude, longitude);
            setLocation(latitude, longitude, info.city, info.province);
          } catch (error) {
            console.error("Error mendapatkan info lokasi", error);
          } finally {
            setLoading(false);
          }
        },
        () => {
          console.warn("User denied location access");
          setLocation(
            -6.200000,
            106.816666,
            "Jakarta",
            "DKI Jakarta"
          );
          setLoading(false);
        }
      );
    }
  }, [setLocation]);

  return (
    <div className="max-w-md mx-auto mt-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 flex items-center gap-3">
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="animate-spin h-5 w-5" />
            <span>Mendeteksi lokasi...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <MapPin className="text-red-500 h-6 w-6" />
            <span className="text-gray-700 dark:text-gray-200">
              Lokasi terdeteksi:{" "}
              <b>
                {city}, {province}
              </b>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}