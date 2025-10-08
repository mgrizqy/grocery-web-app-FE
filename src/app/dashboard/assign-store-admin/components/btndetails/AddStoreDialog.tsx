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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";

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
        formState: { errors, isSubmitting },
    } = useForm<UpdateStoreSchema>({
        resolver: zodResolver(updateStoreSchema),
        defaultValues: {
            storeName: "",
            address: "",
            city: "",
            province: "",
            latitude: 0,
            longitude: 0,
            is_active: storeStatus,
        },
    });

    // fetch users (store-admin candidates)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await apiCall.get("/api/user/store-admin");
                const usersArray = Array.isArray(res.data)
                    ? res.data
                    : res.data?.data || [];
                setUsers(usersArray);
            } catch (error) {
                console.error("Failed to fetch users:", error);
                setUsers([]);
            }
        };
        fetchUsers();
    }, []);

    const onBtnSubmit = async (data: UpdateStoreSchema) => {
        try {
            const payload = {
                name: data.storeName,
                address: data.address,
                city: data.city,
                province: data.province,
                latitude: data.latitude,
                longitude: data.longitude,
                is_active: storeStatus,
                adminIds: selectedAdmins,
            };

            const res = await apiCall.post("/api/store", { payload }); // ✅ update
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
                            {errors.storeName?.message}
                        </div>

                        {/* Address */}
                        <div className="mb-2">
                            <label className="text-sm">Address</label>
                            <Input {...register("address")} />
                        </div>

                        {/* City & Province */}
                        <div className="flex gap-x-2 mb-2">
                            <div className="w-full">
                                <label className="text-sm">City</label>
                                <Input {...register("city")} />
                            </div>
                            <div className="w-full">
                                <label className="text-sm">Province</label>
                                <Input {...register("province")} />
                            </div>
                        </div>

                        {/* Status & Admins */}
                        <div className="flex gap-x-2 mb-2 justify-between">
                            {/* Store Status */}
                            <div className="mb-2 w-full">
                                <label className="text-sm">Store Status</label>
                                <Select
                                    value={storeStatus ? "active" : "inactive"}
                                    onValueChange={(value) =>
                                        setStoreStatus(value === "active")
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        <SelectGroup>
                                            <SelectItem value="active">
                                                Active
                                            </SelectItem>
                                            <SelectItem value="inactive">
                                                Inactive
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Store Admins */}
                            <div className="mb-2 w-full">
                                <label className="text-sm">Store Admins</label>
                                <Select
                                    onValueChange={(value) => {
                                        setSelectedAdmins((prev) =>
                                            prev.includes(value)
                                                ? prev.filter(
                                                        (id) => id !== value
                                                    )
                                                : [...prev, value]
                                        );
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Admins" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        <SelectGroup>
                                            {users.map((user) => (
                                                <SelectItem
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    <div className="flex items-center w-full">
                                                        <span>
                                                            {user.first_name}{" "}
                                                            {user.last_name}
                                                        </span>
                                                        {selectedAdmins.includes(
                                                            user.id
                                                        ) && (
                                                            <span className="text-xs text-green-600 ml-2">
                                                                ✔
                                                            </span>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Map Picker */}
                        <div className="w-full max-w-md h-40 mx-auto my-4">
                            <MapPicker
                                disabled={false}
                                defaultLocation={{
                                    lat: 0,
                                    long: 0,
                                    road: "",
                                    city: "",
                                    province: "",
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
                        <Button
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                reset();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            form="addStoreForm"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Add Store"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
