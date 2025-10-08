"use client";

import { useEffect, useState } from "react";
import { useAddressStore } from "@/store/address-store";
import AddAddressModal from "./address/AddAddressModal";
import EditAddressModal from "./address/EditAddressModal";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { Pencil, Trash2, MapPin } from "lucide-react";

export default function AddressList() {
  const { addresses, fetchAddress, deleteAddress, setPrimary, loading, error } =
    useAddressStore();

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<Number | null>(null);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow max-w-3xl w-full mx-auto mt-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Alamat Saya</h2>
        <AddAddressModal />
      </div>
      {loading && <p>Memuat alamat...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="border rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition flex flex-col gap-2 bg-gray-50 dark:bg-gray-900"
        >
          <div className="flex justify-between items-start sm:items-center">
            <div className="flex items-center gap-2 text-gray-800 dark:text-white">
              <MapPin className="w-5 h-5 text-green-500" />
              <div>
                <h3 className="font-semibold text-base">{addr.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{addr.phone}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-2 sm:mt-0">
              <button
                title="Edit"
                className="text-blue-600 hover:text-blue-800 transition"
              >
                <EditAddressModal address={addr}>
                  <Pencil className="w-5 h-5" />
                </EditAddressModal>
              </button>
              <button
                title="Hapus"
                onClick={() => {
                  setSelectedId(addr.id);
                  setOpen(true);
                }}
                className="text-red-600 hover:text-red-800 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300">
            {addr.street} ({addr.detail})
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {addr.district}, {addr.city}, {addr.province}, ID {addr.postal_code}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {addr.is_primary ? (
              <span className="text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">
                Utama
              </span>
            ) : (
              <button
                onClick={() => setPrimary(addr.id)}
                className="text-xs border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Atur sebagai utama
              </button>
            )}
            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full dark:bg-gray-700 dark:text-white">
              {addr.label}
            </span>
          </div>
        </div>
      ))}
      <ConfirmDeleteDialog
        open={open}
        setOpen={setOpen}
        data={selectedId}
        onConfirm={(id) => {
          if (id) {
            deleteAddress(id);
          }
        }}
      />
    </div>
  );
}
