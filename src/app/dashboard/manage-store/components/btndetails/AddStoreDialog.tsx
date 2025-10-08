"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { apiCall } from "@/helper/apiCall";
import {
    updateStoreSchema,
    UpdateStoreSchema,
} from "@/helper/updateStoreSchema";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import useWilayah from "@/hooks/use-wilayah"; // pastikan hook ini sesuai
import { useEffect } from "react";

// MapPicker dengan SSR disabled
const MapPicker = dynamic(() => import("@/components/MapPickerInner"), {
    ssr: false,
});

interface IUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

export default function AddStoreDialog() {
  const [open, setOpen] = useState(false);
  const [storeStatus, setStoreStatus] = useState<boolean>(true);
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateStoreSchema>({
    resolver: zodResolver(updateStoreSchema),
    defaultValues: {
      storeName: "",
      address: "",
      city: "",
      city_id: "",
      province: "",
      province_id: "",
      latitude: -6.2,
      longitude: 106.816666,
      is_active: storeStatus,
    },

  });

  const onBtnSubmit = async (data: UpdateStoreSchema) => {
    try {
        const payload = {
          name: data.storeName,
          address: data.address,
          city: data.city,
          city_id: data.city_id,
          province: data.province,
          province_id: data.province_id,
          latitude: data.latitude,
          longitude: data.longitude,
          is_active: storeStatus,
          adminIds: selectedAdmins,
        };


        const res = await apiCall.post("/api/store", { payload });
        if (res.data) {
            toast.success("Add Store Success");
            setOpen(false);
            reset();
            window.location.reload();
        }
    } catch (error) {
        console.error(error);
        toast.error("Failed to add store");
    }
  };

  // Ambil nilai saat ini dari form
  const watchedLat = watch("latitude");
  const watchedLong = watch("longitude");

  // Koordinat default (Jakarta) jika belum diisi
  const defaultLocation = {
    lat: watchedLat !== 0 ? watchedLat : -6.2,
    long: watchedLong !== 0 ? watchedLong : 106.816666,
    road: watch("address") || "",
    city: watch("city") || "",
    province: watch("province") || "",
  };

  const { provinces, cities } = useWilayah({
    provinceId: watch("province_id"),
    cityId: watch("city_id"),
  });

  // Autofill nama dari ID yang dipilih
  useEffect(() => {
    const selectedProvince = provinces.find((p) => p.province_id === watch("province_id"));
    const selectedCity = cities.find((c) => c.city_id === watch("city_id"));

    setValue("province", selectedProvince?.province || "");
    setValue("city", selectedCity?.city_name || "");
  }, [watch("province_id"), watch("city_id"), provinces, cities]);


  return (
    <>
      <Button onClick={() => setOpen(true)}>+ Add Store</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add New Store</DialogTitle>
                <DialogDescription>
                    Fill in the details to create a new store
                </DialogDescription>
            </DialogHeader>

          <form id="addStoreForm" onSubmit={handleSubmit(onBtnSubmit)}>
            {/* Store Name */}
            <div className="mb-2">
                <label className="text-sm">Name</label>
                <Input {...register("storeName")} />
                {errors.storeName?.message && (
                    <p className="text-xs text-red-500">
                        {errors.storeName.message}
                    </p>
                )}
            </div>

            {/* Address */}
            <div className="mb-2">
                <label className="text-sm">Address</label>
                <Input {...register("address")} value={watch("address")} />
            </div>

            {/* Province Select */}
            <div className="mb-2">
              <label className="text-sm">Provinsi</label>
              <select
                {...register("province_id")}
                className="input w-full"
                defaultValue=""
              >
                <option value="">Pilih Provinsi</option>
                {provinces.map((prov) => (
                  <option key={prov.province_id} value={prov.province_id}>
                    {prov.province}
                  </option>
                ))}
              </select>
            </div>

            {/* City Select */}
            <div className="mb-2">
              <label className="text-sm">Kota</label>
              <select
                {...register("city_id")}
                className="input w-full"
                disabled={!watch("province_id")}
                defaultValue=""
              >
                <option value="">Pilih Kota</option>
                {cities.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.city_name}
                  </option>
                ))}
              </select>
            </div>
            {/* Store Status */}
            <div className="mb-2 w-full">
              <label className="text-sm">Store Status</label>
              <Select
                value={storeStatus ? "active" : "inactive"}
                onValueChange={(value) => setStoreStatus(value === "active")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectGroup>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Map Picker */}
            <div id="map-picker" className="w-full max-w-md h-40 mx-auto my-4">
              <MapPicker
                disabled={false}
                defaultLocation={defaultLocation}
                onLocationSelect={(data) => {
                  setValue("address", data.road);
                  setValue("latitude", data.lat);
                  setValue("longitude", data.long);
                  // Optional, jika data.city atau data.province dari MapPicker bisa dipakai:
                  // setValue("city", data.city);
                  // setValue("province", data.province);
              }}
              />
            </div>
          </form>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button form="addStoreForm" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Store"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}