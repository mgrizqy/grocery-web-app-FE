import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import useWilayah from "@/hooks/use-wilayah";
import MapPicker from "@/components/MapPickerInner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { renderOptions } from "./renderOptions";
import { AddressFormValues } from "./types";
import { useForm } from "react-hook-form";

interface AddressFormProps {
  formMethods: ReturnType<typeof useForm<AddressFormValues>>;
  onSubmit: (data: AddressFormValues) => void;
}

export default function AddressForm({ formMethods, onSubmit }: AddressFormProps) {
  const { register, handleSubmit, watch, setValue } = formMethods;
  const provinceId = useWatch({ control: formMethods.control, name: "province" });
  const cityId = useWatch({ control: formMethods.control, name: "city" });
  const districtId = useWatch({ control: formMethods.control, name: "district" });
  const subdistrictId = useWatch({ control: formMethods.control, name: "subdistrict" });

  const { provinces, cities, districts, subdistricts } = useWilayah({
    provinceId,
    cityId,
    districtId,
  });

  const selectedSub = subdistricts.find(s => s.subdistrict_id === subdistrictId);

  useEffect(() => {
    if (selectedSub?.zip_code) {
      setValue("postal_code", selectedSub.zip_code);
    } else {
      setValue("postal_code", "");
    }
  }, [selectedSub, setValue]);


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Semua input dan select */}
          {/* Contoh: */}
          <div>
            <Label className="mb-3">Nama</Label>
            <Input {...register("name")} placeholder="Nama penerima" />
          </div>
          
          {/* select provinsi */}
          <div>
            <Label className="mb-3">Provinsi</Label>
            <select {...register("province")} className="input w-full">
              {renderOptions(provinces, "province_id", "province", "Pilih Provinsi")}
            </select>
          </div>
          <div>
              <Label className="mb-3">Kota/Kabupaten</Label>
              <select
                {...register("city")}
                className="input w-full"
                disabled={!watch("province")}
              >
                {renderOptions(cities, "city_id", "city_name", "Pilih Kota")}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-3">Kecamatan</Label>
              <select
                {...register("district")}
                className="input w-full"
                disabled={!watch("city")}
              >
                {renderOptions(
                  districts,
                  "district_id",
                  "district_name",
                  "Pilih Kecamatan"
                )}
              </select>
            </div>
          {/* Kelurahan/Desa */}
            <div>
              <Label className="mb-3">Kelurahan/Desa</Label>
              <select
                {...register("subdistrict")}
                className="input w-full"
                disabled={!watch("district")}
              >
                {renderOptions(
                  subdistricts,
                  "subdistrict_id",
                  "subdistrict_name",
                  "Pilih Kelurahan/Desa"
                )}
              </select>
            </div>

          </div>
          {/* Kecamatan */}
          <div>
            <Label className="mb-3">Kode Pos</Label>
            <Input {...register("postal_code")} readOnly />
          </div>

          <div>
            <Label className="mb-3">Nama Jalan</Label>
            <Input {...register("street")} placeholder="Jl. Contoh No. 123" />
          </div>

          <div>
            <Label className="mb-3">Detail Alamat</Label>
            <textarea
              {...register("detail")}
              placeholder="Blok, RT/RW, patokan, dll"
              className="w-full border rounded p-2"
            ></textarea>
          </div>
      
      {/* MapPicker */}
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
          onLocationSelect={(data) => {
            setValue("latitude", data.lat);
            setValue("longitude", data.long);
          }}
        />
      </div>

      {/* Tombol aksi */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={() => formMethods.reset()}
          className="bg-gray-500 text-white"
        >
          Batal
        </button>
        <button type="submit" className="bg-green-600 text-white">
          Simpan
        </button>
      </div>
    </form>
  );
}
