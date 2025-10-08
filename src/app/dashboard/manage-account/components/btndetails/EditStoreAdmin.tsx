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
import { IUserProps } from "@/types/user";
import React, { useEffect, useState } from "react";

interface INewStoreAdmin {
  open: boolean;
  setOpen: (value: boolean) => void;
  storeList: any[];
  selectedUser: any;
}
export default function EditStoreAdmin({
  open,
  setOpen,
  storeList,
  selectedUser,
}: INewStoreAdmin) {
  const [storeAdminData, setStoreAdminData] = useState<IUserProps | null>(null);
  const getStoreAdminById = async () => {
    try {
      const id = selectedUser.toString();
      const res = await apiCall.get(`/api/user/${id}`);
      const result = res.data.data[0];
      setStoreAdminData(result);
    } catch (error) {
      console.log(error);
    }
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedStore, setSelectedStore] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const first_name = formData.get("first_name")?.toString().trim() || "";
    const last_name = formData.get("last_name")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString().trim() || "";
    const phone = formData.get("phone")?.toString().trim() || "";

    const payload: any = {
      first_name,
      last_name,
      email,
      phone,
      store_id: Number(selectedStore),
    };

    if (password) {
      payload.password = password;
    }

    if (!first_name || !last_name || !email || !phone || !selectedStore) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const id = selectedUser;
      console.log(id);
      const res = await apiCall.patch(`/api/user/update-user/${id}`, payload);
      alert("Edit store admin success");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSelectedStore(selectedStore);
  }, [selectedStore]);

  useEffect(() => {
    if (open && selectedUser) {
      getStoreAdminById();
    }
  }, [open, selectedUser]);
  useEffect(() => {
    if (storeAdminData) {
      setFirstName(storeAdminData.first_name || "");
      setLastName(storeAdminData.last_name || "");
      setEmail(storeAdminData.email || "");
      setPhone(storeAdminData.phone || "");
      setSelectedStore(storeAdminData?.store_id.toString() || "");
    }
  }, [storeAdminData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Store Admin</DialogTitle>
          <DialogDescription>Edit Your Store Admin</DialogDescription>
        </DialogHeader>
        {/* Form Create SA */}
        <form id="new-store-admin" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label>First Name</label>
              <Input
                placeholder="Input First Name"
                value={firstName}
                name="first_name"
                autoComplete="off"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label>Last Name</label>
              <Input
                placeholder="Input Last Name"
                name="last_name"
                autoComplete="off"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div>
              <label>Email</label>
              <Input
                type="email"
                name="email"
                placeholder="Input Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>New Password</label>
              <Input
                autoComplete="off"
                placeholder="Input Password"
                name="password"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label>Phone Number</label>
              <Input
                placeholder="+62321456"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div id="select-store" className="">
              <label>Select Store</label>
              <Select
                value={selectedStore}
                onValueChange={(value) => setSelectedStore(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select New Store"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {storeList.map((store, idx) => (
                      <SelectItem key={idx} value={store.id.toString()}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="new-store-admin"
            className="bg-blue-500 hover:bg-blue-600"
          >
            Edit Store Admin
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
