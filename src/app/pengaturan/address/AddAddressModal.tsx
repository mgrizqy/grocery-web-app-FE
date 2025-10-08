"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAddressStore } from "@/store/address-store";
import useWilayah, { Wilayah } from "@/hooks/use-wilayah";
import { Label } from "@/components/ui/label";
import { InputGroup, SelectGroup, Radio } from "../component/FormParts";


// Dynamic import map
const MapPicker = dynamic(() => import("@/components/MapPickerInner"), { ssr: false });

interface AddressFormValues { name: string; phone: string; province: string; city: string; district: string; subdistrict: string; postal_code: string; street: string; detail: string; label: "RUMAH" | "KANTOR"; is_primary: boolean; latitude: number; longitude: number; }

export default function AddAddressModal() {
  const { addAddress } = useAddressStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, reset, setValue } = useForm<AddressFormValues>({
    defaultValues: {
      name: "", phone: "", province: "", city: "", district: "",
      subdistrict: "", postal_code: "", street: "", detail: "",
      label: "RUMAH", is_primary: false,
      latitude: -6.2, longitude: 106.816666,
    },
  });

  const { provinces, cities, districts, subdistricts } = useWilayah({
    provinceId: watch("province"),
    cityId: watch("city"),
    districtId: watch("district"),
  });

  const selectedSub = useMemo(
    () => subdistricts.find(s => s.subdistrict_id === watch("subdistrict")),
    [subdistricts, watch("subdistrict")]
  );

  useEffect(() => {
    setValue("postal_code", selectedSub?.zip_code ?? "");
  }, [selectedSub, setValue]);

  const fetchCoordinates = useCallback(async () => {
    const names = [
      subdistricts.find(s => s.subdistrict_id === watch("subdistrict"))?.subdistrict_name,
      districts.find(d => d.district_id === watch("district"))?.district_name,
      cities.find(c => c.city_id === watch("city"))?.city_name,
      provinces.find(p => p.province_id === watch("province"))?.province,
      "Indonesia",
    ].filter(Boolean).join(", ");

    if (!names) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(names)}`);
      const data = await res.json();
      if (data.length) {
        setValue("latitude", parseFloat(data[0].lat));
        setValue("longitude", parseFloat(data[0].lon));
      }
    } catch (err) {
      console.error("Failed to fetch coordinates:", err);
    }
  }, [provinces, cities, districts, subdistricts, watch, setValue]);

  useEffect(() => {
    fetchCoordinates();
  }, [fetchCoordinates]);

  const handleSave = async (data: AddressFormValues) => {
    setLoading(true);
    const provinceName = provinces.find(p => p.province_id === data.province)?.province || "";
    const cityName = cities.find(c => c.city_id === data.city)?.city_name || "";
    const districtName = districts.find(d => d.district_id === data.district)?.district_name || "";
    const subdistrictName = subdistricts.find(s => s.subdistrict_id === data.subdistrict)?.subdistrict_name || "";

    const payload = { ...data, province: provinceName, city: cityName, district: districtName, subdistrict: subdistrictName,province_id: data.province, city_id: data.city, district_id: data.district, subdistrict_id: data.subdistrict,};
    const success = await addAddress(payload);
    setLoading(false);

    if (success) {
      toast.success("Alamat berhasil ditambahkan!");
      reset();
      setOpen(false);
    } else {
      toast.error("Gagal menambahkan alamat");
    }
  };

  const renderOptions = (items: Wilayah[], valueKey: keyof Wilayah, labelKey: keyof Wilayah, placeholder: string) => (
    <>
      <option value="">{placeholder}</option>
      {items.map(item => (
        <option key={String(item[valueKey])} value={String(item[valueKey])}>
          {String(item[labelKey])}
        </option>
      ))}
    </>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 text-white">+ Tambah Alamat</Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Tambah Alamat Baru</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSave)} className="space-y-4 mt-4">
          {/* Basic Inputs */}
          <InputGroup label="Nama" reg={register("name")} placeholder="Nama penerima" />
          <InputGroup label="Nomor Telepon" reg={register("phone")} placeholder="08xxxx" />

          {/* Dropdowns */}
          <div className="grid grid-cols-2 gap-3">
            <SelectGroup label="Provinsi" reg={register("province")} options={renderOptions(provinces, "province_id", "province", "Pilih Provinsi")} />
            <SelectGroup label="Kota/Kabupaten" reg={register("city")} disabled={!watch("province")} options={renderOptions(cities, "city_id", "city_name", "Pilih Kota")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SelectGroup label="Kecamatan" reg={register("district")} disabled={!watch("city")} options={renderOptions(districts, "district_id", "district_name", "Pilih Kecamatan")} />
            <SelectGroup label="Kelurahan/Desa" reg={register("subdistrict")} disabled={!watch("district")} options={renderOptions(subdistricts, "subdistrict_id", "subdistrict_name", "Pilih Kelurahan/Desa")} />
          </div>

          <InputGroup label="Kode Pos" reg={register("postal_code")} readOnly />
          <InputGroup label="Nama Jalan" reg={register("street")} placeholder="Jl. Contoh No. 123" />

          {/* Detail Alamat */}
          <div>
            <Label>Detail Alamat</Label>
            <textarea {...register("detail")} placeholder="Blok, RT/RW, patokan, dll" className="w-full border rounded p-2" />
          </div>

          {/* Map */}
          <div className="w-full max-w-md h-40 mx-auto my-4">
            <MapPicker
              disabled={false}
              defaultLocation={{
                lat: watch("latitude"),
                long: watch("longitude"),
                road: watch("street"),
                city: watch("city"),
                province: watch("province"),
              }}
              onLocationSelect={(loc) => {
                setValue("latitude", loc.lat);
                setValue("longitude", loc.long);
              }}
            />
          </div>

          {/* Label Alamat */}
          <div>
            <Label>Label Alamat</Label>
            <div className="flex gap-6 mt-1">
              <Radio label="Rumah" value="RUMAH" reg={register("label")} />
              <Radio label="Kantor" value="KANTOR" reg={register("label")} />
            </div>
          </div>

          {/* Primary Checkbox */}
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("is_primary")} />
            <span>Jadikan alamat utama</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" onClick={() => setOpen(false)} className="bg-gray-500 text-white">Batal</Button>
            <Button type="submit" className="bg-green-600 text-white" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}