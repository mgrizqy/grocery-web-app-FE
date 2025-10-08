"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAddressStore } from "@/store/address-store";
import { useLocationStore } from "@/store/location-store";
import { Loader2 } from "lucide-react";
import MapPicker from "../MapPickerWrapper";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { City, Province } from "../types";

interface AddNewAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface AddressFormData {
  label: "RUMAH" | "KANTOR";
  name: string;
  phone: string;
  province_id: string;
  province: string;
  city_id: string;
  city: string;
  district: string;
  subdistrict: string;
  street: string;
  postal_code: string;
  is_primary: boolean;
  detail: string;
  latitude: number | null;
  longitude: number | null;
}

interface AddressFormContentProps {
  form: AddressFormData;
  setForm: React.Dispatch<React.SetStateAction<AddressFormData>>;
  provinces: Province[];
  cities: City[];
  loadingProvinces: boolean;
  loadingCities: boolean;
  fetchCities: (provinceId: string) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCheckboxChange: (checked: boolean) => void;
  handleLocationSelect: (data: {
    lat: number;
    long: number;
    road: string;
    city: string;
    province: string;
  }) => void;
  disabled: boolean;
}

const AddressFormContent = ({
  form,
  setForm,
  provinces,
  cities,
  loadingProvinces,
  loadingCities,
  fetchCities,
  handleChange,
  handleCheckboxChange,
  handleLocationSelect,
  disabled,
}: AddressFormContentProps) => (
  <div className="space-y-4">
    <div className="h-[150px] w-full bg-gray-200 rounded-lg overflow-hidden">
      <MapPicker onLocationSelect={handleLocationSelect} disabled={disabled} />
    </div>

    <div className="space-y-1">
      <Label htmlFor="label">Label</Label>
      <Input
        id="label"
        value={form.label}
        onChange={handleChange}
        placeholder="Enter label"
        required
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label htmlFor="name">Recipient Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter recipient's full name"
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          required
        />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label htmlFor="province">Province</Label>
        <Select
          value={form.province_id}
          onValueChange={(value) => {
            const selectedProvince = provinces.find(
              (p) => p.province_id === value
            );
            setForm({
              ...form,
              province_id: value,
              province: selectedProvince?.province || "",
              city_id: "",
              city: "",
            });
            fetchCities(value);
          }}
          disabled={loadingProvinces}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a province" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((p) => (
              <SelectItem key={p.province_id} value={p.province_id}>
                {p.province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="city">City</Label>
        <Select
          value={form.city_id}
          onValueChange={(value) => {
            const selectedCity = cities.find((c) => c.city_id === value);
            setForm({
              ...form,
              city_id: value,
              city: selectedCity?.city_name || "",
              postal_code: selectedCity?.postal_code || "",
            });
          }}
          disabled={!form.province_id || loadingCities}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((c) => (
              <SelectItem key={c.city_id} value={c.city_id}>
                {c.city_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label htmlFor="district">District</Label>
        <Input
          id="district"
          value={form.district}
          onChange={handleChange}
          placeholder="Enter district"
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="postal_code">Postal Code</Label>
        <Input
          id="postal_code"
          value={form.postal_code}
          onChange={handleChange}
          placeholder="Enter postal code"
          required
        />
      </div>
    </div>

    <div className="space-y-1">
      <Label htmlFor="street">Street Address</Label>
      <Textarea
        id="street"
        value={form.street}
        onChange={handleChange}
        placeholder="Enter Address"
        required
      />
    </div>

    <div className="space-y-1">
      <Label htmlFor="detail">{"Address Detail (Optional)"}</Label>
      <Input
        id="detail"
        value={form.detail || ""}
        onChange={handleChange}
        placeholder="Enter detail"
      />
    </div>

    <div className="flex items-center space-x-2 pt-2">
      <Checkbox
        id="is_primary"
        checked={form.is_primary}
        onCheckedChange={(checked) => handleCheckboxChange(!!checked)}
      />
      <Label htmlFor="is_primary">Set as primary address</Label>
    </div>
  </div>
);

export default function AddNewAddressModal({
  open,
  onOpenChange,
  onSuccess,
}: AddNewAddressModalProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { addAddress, loading } = useAddressStore();
  const {
    provinces,
    cities,
    loadingProvinces,
    loadingCities,
    fetchProvinces,
    fetchCities,
  } = useLocationStore();

  const initialFormState: AddressFormData = {
    label: "RUMAH",
    name: "",
    phone: "",
    province_id: "",
    province: "",
    city_id: "",
    city: "",
    district: "",
    subdistrict: "",
    street: "",
    postal_code: "",
    is_primary: false,
    detail: "",
    latitude: null,
    longitude: null,
  };
  const [form, setForm] = useState<AddressFormData>(initialFormState);

  useEffect(() => {
    if (open) {
      fetchProvinces();
    }
  }, [open, fetchProvinces]);

  const handleLocationSelect = (data: {
    lat: number;
    long: number;
    road: string;
    city: string;
    province: string;
  }) => {
    setForm((prev) => ({
      ...prev,
      street: data.road,
      city: data.city,
      province: data.province,
      latitude: data.lat,
      longitude: data.long,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, is_primary: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addAddress(form);
    if (success) {
      setForm(initialFormState);
      onSuccess();
    }
  };

  const formProps = {
    form,
    setForm,
    provinces,
    cities,
    loadingProvinces,
    loadingCities,
    fetchCities,
    handleChange,
    handleCheckboxChange,
    handleLocationSelect,
    disabled: loading,
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>
              Pin your location on the map or fill in the details manually.
            </DialogDescription>
          </DialogHeader>
          <form id="address-form-desktop" onSubmit={handleSubmit}>
            <div className="py-4 h-fit  pr-4">
              <AddressFormContent {...formProps} />
            </div>
          </form>
          <DialogFooter>
            <Button
              type="submit"
              form="address-form-desktop"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add New Address</DrawerTitle>
          <DrawerDescription>
            Pin your location on the map or fill in the details manually.
          </DrawerDescription>
        </DrawerHeader>
        <form
          id="address-form-mobile"
          onSubmit={handleSubmit}
          className="flex-1 overflow-auto"
        >
          <div className="p-4 px-8 pt-0 max-h-[70vh] ">
            <AddressFormContent {...formProps} />
          </div>
        </form>
        <DrawerFooter className="pt-2">
          <Button type="submit" form="address-form-mobile" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Address
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
