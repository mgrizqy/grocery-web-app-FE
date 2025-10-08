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
import { IStoreProps } from "@/types/store";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";

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
      province: store.province,
      latitude: store.latitude,
      longitude: store.longitude,
      is_active: storeStatus,
    },
  });
  const [edit, setEdit] = useState(false);

  const onBtnSubmit = async (data: any) => {
    try {
      const store_id = store.id;
      const payload = {
        name: data.storeName,
        address: data.address,
        city: data.city,
        province: data.province,
        latitude: data.latitude,
        longitude: data.longitude,
        is_active: storeStatus,
      };
      const res = await apiCall.patch(`/api/store/${store_id}`, { payload });
      if (res.data) {
        toast.success("Update Store Success");
        console.log(res.data);
        setOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

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
            <div id="store-city-province" className="flex gap-x-2">
              <div id="city" className="w-full">
                <label className="text-sm">City/County</label>
                <Input
                  disabled={!edit}
                  {...register("city")}
                  className="max-sm:text-xs"
                />
              </div>
              <div id="province" className="w-full">
                <label className="text-sm">Province</label>
                <Input
                  disabled={!edit}
                  {...register("province")}
                  className="max-sm:text-xs"
                />
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
                disabled={!edit}
                defaultLocation={{
                  lat: store.latitude,
                  long: store.longitude,
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
