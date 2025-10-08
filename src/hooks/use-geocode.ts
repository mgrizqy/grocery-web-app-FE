import { useEffect, useState } from "react";

export function useGeocodeWilayah({
  province,
  city,
  district,
  subdistrict,
}: {
  province?: string;
  city?: string;
  district?: string;
  subdistrict?: string;
}) {
  const [coords, setCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    const searchLocation = async () => {
      if (!province && !city && !district && !subdistrict) return;

      const query = [subdistrict, district, city, province, "Indonesia"]
        .filter(Boolean)
        .join(", ");

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}`
        );
        const data = await res.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setCoords([parseFloat(lat), parseFloat(lon)]);
        }
      } catch (err) {
        console.error("Geocode error:", err);
      }
    };

    searchLocation();
  }, [province, city, district, subdistrict]);

  return coords;
}
