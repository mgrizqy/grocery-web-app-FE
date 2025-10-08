import { useState, useEffect } from "react";
import { apiCall } from "@/helper/apiCall";

export interface Wilayah {
  province_id?: string;
  province?: string;
  city_id?: string;
  city_name?: string;
  type?: string;
  postal_code?: string;
  district_id?: string;
  district_name?: string;
  subdistrict_id?: string;
  subdistrict_name?: string;
  zip_code?: string;
}

interface Props {
  provinceId?: string;
  cityId?: string;
  districtId?: string;
}

export default function useWilayah({ provinceId, cityId, districtId }: Props) {
  const [provinces, setProvinces] = useState<Wilayah[]>([]);
  const [cities, setCities] = useState<Wilayah[]>([]);
  const [districts, setDistricts] = useState<Wilayah[]>([]);
  const [subdistricts, setSubdistricts] = useState<Wilayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fetch provinces
  useEffect(() => {
    setLoading(true);
    apiCall
      .get<Wilayah[]>("/api/rajaongkir/provinces")
      .then((res) => setProvinces(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // fetch cities
  useEffect(() => {
    if (!provinceId) return;
    setLoading(true);
    apiCall
      .get<Wilayah[]>(`/api/rajaongkir/cities/${provinceId}`)
      .then((res) => setCities(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [provinceId]);

  // fetch districts
  useEffect(() => {
    if (!cityId) return;
    setLoading(true);
    apiCall
      .get<Wilayah[]>(`/api/rajaongkir/districts/${cityId}`)
      .then((res) => setDistricts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [cityId]);

  // fetch subdistricts
  useEffect(() => {
    if (!districtId) return;
    setLoading(true);
    apiCall
      .get<Wilayah[]>(`/api/rajaongkir/subdistricts/${districtId}`)
      .then((res) => setSubdistricts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [districtId]);

  return { provinces, cities, districts, subdistricts, loading, error };
}
