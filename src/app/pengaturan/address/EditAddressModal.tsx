"use client";

import { useState, useEffect, ReactNode } from "react";
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
import { Input } from "@/components/ui/input";
import MapPickerWrapper from "../component/MapPickerWrapper";

interface AddressFormValues {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  subdistrict: string;
  postal_code: string;
  street: string;
  detail: string;
  label: "RUMAH" | "KANTOR";
  is_primary: boolean;
  latitude?: number;
  longitude?: number;
}

interface EditAddressModalProps {
  address: AddressFormValues & { id: number };
  children?: ReactNode;
}

export default function EditAddressModal({ address, children }: EditAddressModalProps) {
  const { updateAddress } = useAddressStore();
  const { register, handleSubmit, watch, reset, setValue } =
    useForm<AddressFormValues>({ defaultValues: address });

  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<[number, number] | null>(null);

  const { provinces, cities, districts, subdistricts } = useWilayah({
    provinceId: watch("province"),
    cityId: watch("city"),
    districtId: watch("district"),
  });

  const selectedSub = subdistricts.find(
    (s) => s.subdistrict_id === watch("subdistrict")
  );

  useEffect(() => {
    setValue("postal_code", selectedSub?.zip_code || "");
  }, [selectedSub, setValue]);

  useEffect(() => {
    if (!open) return;
    const provinceId = provinces.find((p) => p.province === address.province)?.province_id || "";
    const cityId = cities.find((c) => c.city_name === address.city)?.city_id || "";
    const districtId = districts.find((d) => d.district_name === address.district)?.district_id || "";
    const subdistrictId = subdistricts.find((s) => s.subdistrict_name === address.subdistrict)?.subdistrict_id || "";

    reset({
      ...address,
      province: provinceId,
      city: cityId,
      district: districtId,
      subdistrict: subdistrictId,
      latitude: address.latitude ?? 0,
      longitude: address.longitude ?? 0,
    });

    if (address.latitude && address.longitude) {setCoords([address.latitude, address.longitude]);}
  }, [open]);

  const onSubmit = async (data: AddressFormValues) => {
    const payload = {
      ...data,
      province: provinces.find((p) => p.province_id === data.province)?.province || "",
      city: cities.find((c) => c.city_id === data.city)?.city_name || "",
      district: districts.find((d) => d.district_id === data.district)?.district_name || "",
      subdistrict: subdistricts.find((s) => s.subdistrict_id === data.subdistrict)?.subdistrict_name || "",
      latitude: coords?.[0],
      longitude: coords?.[1],
    };
    const success = await updateAddress(Number(address.id), payload);
    if (success) {
      toast.success("Alamat berhasil diperbarui!");
      setOpen(false);
      reset(payload);
    }
  };

  const renderOptions = ( items: Wilayah[], valueKey: keyof Wilayah, labelKey: keyof Wilayah, placeholder: string) => (
    <>
      <option value="">{placeholder}</option>
      {items.map((i) => (
        <option key={String(i[valueKey])} value={String(i[valueKey])}>
          {String(i[labelKey])}
        </option>
      ))}
    </>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (children) : (<Button className="bg-blue-600 text-white">Edit</Button>)}
      </DialogTrigger>

      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Alamat</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div><Label>Nama</Label><Input {...register("name")} /></div>
          <div><Label>Nomor Telepon</Label><Input {...register("phone")} /></div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Provinsi</Label>
              <select {...register("province")} className="input w-full">
                {renderOptions(provinces, "province_id", "province", "Pilih Provinsi")}
              </select>
            </div>
            <div>
              <Label>Kota</Label>
              <select {...register("city")} className="input w-full" disabled={!watch("province")}>
                {renderOptions(cities, "city_id", "city_name", "Pilih Kota")}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Kecamatan</Label>
              <select {...register("district")} className="input w-full" disabled={!watch("city")}>
                {renderOptions(districts, "district_id", "district_name", "Pilih Kecamatan")}
              </select>
            </div>
            <div>
              <Label>Kelurahan</Label>
              <select {...register("subdistrict")} className="input w-full" disabled={!watch("district")}>
                {renderOptions(subdistricts, "subdistrict_id", "subdistrict_name", "Pilih Kelurahan")}
              </select>
            </div>
          </div>

          <div><Label>Kode Pos</Label><Input {...register("postal_code")} readOnly /></div>
          <div><Label>Nama Jalan</Label><Input {...register("street")} /></div>
          <div><Label>Detail Alamat</Label><textarea {...register("detail")} className="w-full border rounded p-2" /></div>
          <div>
            <Label className="mb-2 block">Pin Lokasi</Label>
            <MapPickerWrapper lat={watch("latitude") ?? coords?.[0] ?? 0} long={watch("longitude") ?? coords?.[1] ?? 0} street={watch("street")} city={watch("city")} province={watch("province")} onLocationSelect={(data) => {
                setValue("latitude", data.lat);
                setValue("longitude", data.long);
              }}
            />
          </div>

          <div>
            <Label>Label</Label>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2">
                <input type="radio" value="RUMAH" {...register("label")} /> Rumah
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="KANTOR" {...register("label")} /> Kantor
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("is_primary")} />
            <span>Jadikan alamat utama</span>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" onClick={() => setOpen(false)} className="bg-gray-500 text-white">
              Batal
            </Button>
            <Button type="submit" className="bg-blue-600 text-white">Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
