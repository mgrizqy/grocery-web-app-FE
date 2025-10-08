"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useUserStore } from "@/store/user-store";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Image from "next/image";

interface ProfileFormValues {
  first_name: string;
  last_name: string;
  phone?: string;
  bio?: string;
  date_of_birth?: string;
  email: string;
}

export default function ProfilePage() {
  const { updateProfile, updateProfilePicture, resendVerificationEmail } = useUserStore();
  const { user, hydrate } = useAuthStore();
  const [preview, setPreview] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const { register, handleSubmit, setValue } = useForm<ProfileFormValues>();

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => {
    if (!user) return;
    setValue("first_name", user.first_name);
    setValue("last_name", user.last_name);
    setValue("phone", user.phone || "");
    setValue("email", user.email);
    setValue("bio", user.profile?.bio || "");
    setValue("date_of_birth", user.profile?.date_of_birth
      ? new Date(user.profile.date_of_birth).toISOString().split("T")[0]
      : ""
    );
    if (user.image_url) setPreview(user.image_url);
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => v && formData.append(k, v));
    const success = await updateProfile(formData);
    toast[success ? "success" : "error"](success ? "Profil diperbarui!" : "Gagal update profil");
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      toast.error("Format harus JPG, PNG, atau GIF");
      return;
    }
    if (file.size > 1024 * 1024) {
      toast.error("Maksimum ukuran gambar 1MB");
      return;
    }
    setPreview(URL.createObjectURL(file));
    const success = await updateProfilePicture(file);
    if (!success) toast.error("Gagal update foto profil");
  };

  const handleResendVerification = async () => {
    if (!user?.email) return toast.error("Email user tidak ditemukan");
    try {
      setResendLoading(true);
      await resendVerificationEmail();
    } catch (err: any) {
      toast.error(err?.message || "Gagal kirim email verifikasi");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Profil Saya</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-24 h-24 relative rounded-full overflow-hidden border border-gray-300">
            {preview ? (
              <Image src={preview} alt="Profile" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
            )}
          </div>
          <div className="flex flex-col text-sm">
            <input type="file" accept=".jpg,.jpeg,.png,.gif" onChange={handleImageChange} />
            <span className="text-gray-500">Format: JPG, PNG, GIF · Max: 1MB</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm mb-1 block">Nama Depan</label>
            <input type="text" {...register("first_name")} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm mb-1 block">Nama Belakang</label>
            <input type="text" {...register("last_name")} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="text-sm mb-1 block">Email</label>
          <input type="email" {...register("email")} className="w-full border rounded px-3 py-2" />
          {!user?.is_verified && (
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
              <p className="text-red-600">Email belum diverifikasi.</p>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendLoading}
                className={`text-green-600 underline disabled:opacity-50 ${
                  resendLoading ? "cursor-wait" : ""
                }`}
              >
                {resendLoading ? "Mengirim..." : "Kirim Ulang Verifikasi"}
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="text-sm mb-1 block">No. Telepon</label>
          <input type="text" {...register("phone")} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
          >
            Kembali
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
