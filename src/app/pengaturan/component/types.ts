// components/address/types.ts

export interface AddressFormValues {
    name: string;
    phone: string;
    province: string;      // Nama provinsi setelah mapping dari ID
    city: string;          // Nama kota/kabupaten
    district: string;      // Nama kecamatan
    subdistrict: string;   // Nama kelurahan/desa
    postal_code: string;
    street: string;
    detail: string;
    label: "RUMAH" | "KANTOR";
    is_primary: boolean;
    latitude: number;
    longitude: number;

    // ID wilayah (optional tapi biasanya dipakai buat mapping)
    province_id?: string;
    city_id?: string;
    district_id?: string;
    subdistrict_id?: string;
}

// Tipe Wilayah yang sesuai hook useWilayah
export interface Wilayah {
    province_id?: string;
    province?: string;
    city_id?: string;
    city_name?: string;
    district_id?: string;
    district_name?: string;
    subdistrict_id?: string;
    subdistrict_name?: string;
    zip_code?: string;
}
