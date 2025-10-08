"use client";

import { useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddAddressModal from "@/app/pengaturan/address/AddAddressModal";
import { UserAddress } from "../types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

interface AddressSelectorProps {
  addresses: UserAddress[];
  loading: boolean;
  selectedAddressId: number | null;
  setSelectedAddressId: (id: number | null) => void;
}

export default function AddressSelector({
  addresses,
  loading,
  selectedAddressId,
  setSelectedAddressId,
}: AddressSelectorProps) {
  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const primaryAddress = addresses.find((addr) => addr.is_primary);
      setSelectedAddressId(primaryAddress ? primaryAddress.id : addresses[0].id);
    }

    if (!loading && addresses.length === 0) {
      toast.error("Kamu belum menambahkan alamat pengiriman.");
    }
  }, [addresses, selectedAddressId, loading, setSelectedAddressId]);

  return (
    <>
      <Card className="rounded-2xl shadow-lg shadow-gray-200/50 border-0">
        <CardHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-full">
              <MapPin className="w-4 h-4 text-red-500" />
            </div>
            <CardTitle className="text-base sm:text-lg font-bold">
              Delivery Address
            </CardTitle>
          </div>
          <AddAddressModal />
        </CardHeader>

        <CardContent className="p-4">
          {loading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
              <p className="ml-2 text-gray-500">Loading addresses...</p>
            </div>
          )}

          {!loading && addresses.length === 0 && (
            <p className="text-center text-gray-500 p-8">
              No addresses found. Please add a new one.
            </p>
          )}

          {!loading && addresses.length > 0 && (
            <RadioGroup
              value={selectedAddressId?.toString()}
              onValueChange={(value) => setSelectedAddressId(Number(value))}
            >
              <div className="space-y-3">
                {addresses.map((address) => (
                  <Label
                    key={address.id}
                    htmlFor={`addr-${address.id}`}
                    className={cn(
                      "flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer",
                      selectedAddressId === address.id
                        ? "border-primary-green-600 bg-primary-green-50 ring-2 ring-primary-green-500/30"
                        : "border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <RadioGroupItem
                      value={address.id.toString()}
                      id={`addr-${address.id}`}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-gray-800">
                          {address.label}
                        </p>
                        {address.is_primary && (
                          <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-gray-700 text-sm mt-1">
                        {address.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {address.street}, {address.district}, {address.city},{" "}
                        {address.province} {address.postal_code}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {address.phone}
                      </p>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          )}
        </CardContent>
      </Card>
    </>
  );
}
