// utils/wilayahHelpers.ts
import { Wilayah } from "@/hooks/use-wilayah";

export function mapToWilayahId(
    address: any,
    provinces: Wilayah[],
    cities: Wilayah[],
    districts: Wilayah[],
    subdistricts: Wilayah[]
) {
    const provinceId = provinces.find((p) => p.province === address.province)?.province_id || "";
    const cityId = cities.find((c) => c.city_name === address.city)?.city_id || "";
    const districtId = districts.find((d) => d.district_name === address.district)?.district_id || "";
    const subdistrictId = subdistricts.find((s) => s.subdistrict_name === address.subdistrict)?.subdistrict_id || "";

    return { provinceId, cityId, districtId, subdistrictId };
}

export function mapIdToName(
    data: any,
    provinces: Wilayah[],
    cities: Wilayah[],
    districts: Wilayah[],
    subdistricts: Wilayah[]
) {
    const provinceName = provinces.find((p) => p.province_id === data.province)?.province || "";
    const cityName = cities.find((c) => c.city_id === data.city)?.city_name || "";
    const districtName = districts.find((d) => d.district_id === data.district)?.district_name || "";
    const subdistrictName = subdistricts.find((s) => s.subdistrict_id === data.subdistrict)?.subdistrict_name || "";

    return { provinceName, cityName, districtName, subdistrictName };
}
