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
import React, { useEffect, useState } from "react";

interface INewStoreAdmin {
  open: boolean;
  setOpen: (value: boolean) => void;
  storeList: any[];
}
export default function NewStoreAdmin({
  open,
  setOpen,
  storeList,
}: INewStoreAdmin) {
  const [selectedStore, setSelectedStore] = useState<string | undefined>(
    undefined
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone"),
      store_id: selectedStore,
    };
    try {
      const res = await apiCall.post("/api/store/new-store-admin", payload);
      alert("Create new store admin success");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSelectedStore(selectedStore);
  }, [selectedStore]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Store Admin</DialogTitle>
          <DialogDescription>Create Your Store Admin</DialogDescription>
        </DialogHeader>
        {/* Form Create SA */}
        <form id="new-store-admin" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label>First Name</label>
              <Input placeholder="Input First Name" name="first_name" />
            </div>
            <div>
              <label>Last Name</label>
              <Input placeholder="Input Last Name" name="last_name" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div>
              <label>Email</label>
              <Input type="email" placeholder="Input Email" name="email" />
            </div>
            <div>
              <label>Password</label>
              <Input placeholder="Input Password" name="password" />
            </div>
          </div>
          <div>
            <label>Phone Number</label>
            <Input placeholder="+62321456" name="phone" />
          </div>
          <div id="select-store" className="mt-3">
            <label>Select Store</label>
            <Select
              value={selectedStore}
              onValueChange={(value) => setSelectedStore(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Store"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {storeList.map((store, idx) => (
                    <SelectItem key={idx} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" form="new-store-admin">
            Create Store Admin
          </Button>
          <DialogClose asChild>
            <Button
              variant={"destructive"}
              onClick={() => setSelectedStore("")}
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
