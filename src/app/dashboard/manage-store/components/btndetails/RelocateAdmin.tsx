import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiCall } from "@/helper/apiCall";
import { IRelocateAdminData } from "@/types/relocate_admin";
import { IStoreProps } from "@/types/store";
import { IUserProps } from "@/types/user";
import { useState } from "react";
import { toast } from "react-toastify";

interface IRelocateAdmin {
  open: boolean;
  setOpen: (value: boolean) => void;
  adminData: IRelocateAdminData | null;
  storeList: { id: number; name: string }[];
}

export default function RelocateAdmin({
  open,
  setOpen,
  adminData,
  storeList,
}: IRelocateAdmin) {
  const [selectedStoreId, setSelectedStoreId] = useState<string>(
    adminData?.storeId ? adminData.storeId.toString() : ""
  );
  //   console.log(adminData);
  //   console.log(selectedStoreId);
  //   console.log(storeList);
  const handlerChangeStore = async () => {
    if (!adminData?.adminId) return;
    try {
      const res = await apiCall.patch(
        `/api/store/relocate-admin/${adminData.adminId}`,
        {
          store_id: Number(selectedStoreId),
        }
      );
      if (!res) return toast.error("Relocating Admin Error");
      toast.success("Success Relocate Store Admin");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Store Admin Relocation</DialogTitle>
          <DialogDescription className="text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati,
            doloribus!
          </DialogDescription>
        </DialogHeader>
        {/* Store Selector  */}
        <div>
          <div className="flex items-center">
            <p className="w-full">Select Store</p>
            <Select
              value={selectedStoreId.toString()}
              onValueChange={(value) => setSelectedStoreId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Store Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>All Store</SelectLabel>
                  {storeList.map((store) => (
                    <SelectItem key={store.id} value={store.id.toString()}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handlerChangeStore}
          >
            Save Data
          </Button>
          <DialogClose asChild>
            <Button variant={"destructive"}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
