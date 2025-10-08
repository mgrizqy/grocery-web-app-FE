import { Button } from "@/components/ui/button";
import { Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup,SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiCall } from "@/helper/apiCall";
import { updateStoreSchema,UpdateStoreSchema } from "@/helper/updateStoreSchema";
import { IStoreProps } from "@/types/store";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import useWilayah from "@/hooks/use-wilayah"; // Hook wilayah
import { useEffect } from "react";

// MapPicker dengan SSR disabled
const MapPicker = dynamic(() => import("@/components/MapPickerInner"), {
    ssr: false,
});

interface IStoreDetailsDialog {
  open: boolean;
  setOpen: (value: boolean) => void;
  store: IStoreProps;
}

export default function StoreDetailsDialog({
  open,
  setOpen,
  store,
}: IStoreDetailsDialog) {
  const [storeStatus, setStoreStatus] = useState<boolean>(store.is_active);
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateStoreSchema>({
    resolver: zodResolver(updateStoreSchema),
    defaultValues: {
      storeName: store.name,
      address: store.address,
      city: store.city,
      city_id: store.city_id || "",
      province: store.province,
      province_id: store.province_id || "",
      latitude: store.latitude,
      longitude: store.longitude,
      is_active: storeStatus,
    },

  });
  const [edit, setEdit] = useState(false);
  const { provinces, cities } = useWilayah({
    provinceId: watch("province_id"),
  });

  const onBtnSubmit = async (data: any) => {
    try {
      const store_id = store.id;
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
      };
      const res = await apiCall.patch(`/api/store/${store_id}`, { payload });
      if (res.data) {
        toast.success("Update Store Success");
        setOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const selectedProvince = provinces.find((p) => p.province_id === watch("province_id"));
    const selectedCity = cities.find((c) => c.city_id === watch("city_id"));

    setValue("province", selectedProvince?.province || "");
    setValue("city", selectedCity?.city_name || "");
  }, [watch("province_id"), watch("city_id"), provinces, cities]);


  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Store Details</DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </DialogDescription>
          </DialogHeader>
          <form id="storeForm" onSubmit={handleSubmit(onBtnSubmit)}>
            {/* Store Banner */}
            
            {/* Store Profile */}
            <div id="store-name">
              <label className="text-sm">Name</label>
              <Input
                disabled={!edit}
                {...register("storeName")}
                className="max-sm:text-xs"
              />
              {errors.storeName?.message}
            </div>
            <div id="store-address">
              <label className="text-sm">Address</label>
              <Input
                disabled={!edit}
                {...register("address")}
                className="max-sm:text-xs"
              />
            </div>
            <div className="flex gap-x-2">
              <div className="w-full">
                <label className="text-sm">Province</label>
                <select
                  disabled={!edit}
                  {...register("province_id")}
                  onChange={(e) => {
                    const selectedProvId = e.target.value;
                    setValue("province_id", selectedProvId);
                    const selectedProv = provinces.find((p) => p.province_id === selectedProvId);
                    setValue("province", selectedProv?.province || "");
                  }}
                  className="input w-full"
                >
                  <option value="">Pilih Provinsi</option>
                  {provinces.map((prov) => (
                    <option key={prov.province_id} value={prov.province_id}>
                      {prov.province}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <label className="text-sm">City/County</label>
                <select
                  disabled={!edit || !watch("province_id")}
                  {...register("city_id")}
                  onChange={(e) => {
                    const selectedCityId = e.target.value;
                    setValue("city_id", selectedCityId);
                    const selectedCity = cities.find((c) => c.city_id === selectedCityId);
                    setValue("city", selectedCity?.city_name || "");
                  }}
                  className="input w-full"
                >
                  <option value="">Pilih Kota</option>
                  {cities.map((city) => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>


            <div className="flex gap-x-2">
              <div id="status" className=" ">
                <label className="text-sm">Store Status</label>
                <Select
                  disabled={!edit}
                  value={storeStatus ? "active" : "inactive"}
                  onValueChange={(value) => setStoreStatus(value === "active")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="active" className="text-xs">
                        Active
                      </SelectItem>

                      <SelectItem value="inactive" className="text-xs ">
                        Inactive
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div id="map-picker" className="w-full max-w-md h-40 mx-auto my-4">
              <MapPicker
                disabled={false}
                defaultLocation={{
                  lat: store.latitude !== 0 ? store.latitude : -6.2,
                  long: store.longitude !== 0 ? store.longitude : 106.816666,
                  road: store.address || "",
                  city: store.city || "",
                  province: store.province || "",
                }}
                onLocationSelect={(data) => {
                  setValue("address", data.road);
                  setValue("city", data.city);
                  setValue("province", data.province);
                  setValue("latitude", data.lat);
                  setValue("longitude", data.long);
                }}
              />
            </div>
          </form>
          <DialogFooter>
            {!edit ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setEdit(true);
                }}
              >
                Edit Data
              </Button>
            ) : (
              <>
                <Button form="storeForm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving Changes" : "Save Changes"}
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    setEdit(false);
                    reset();
                    setStoreStatus(store.is_active);
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}