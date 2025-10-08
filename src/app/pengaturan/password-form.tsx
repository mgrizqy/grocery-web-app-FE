"use client";

import { useUserStore } from "@/store/user-store";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import PasswordInput from "@/components/PasswordInput";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordFormValues {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function PasswordForm() {
    const { changePassword } = useUserStore();
    const { register, handleSubmit, reset, setValue, watch } = useForm<PasswordFormValues>();
    const { logout } = useAuthStore();
    const router = useRouter();

    const newPassword = watch("newPassword");
    const confirmPassword = watch("confirmPassword");
    const [showOldPassword, setShowOldPassword] = useState(false);

  const onSubmit = async (data: PasswordFormValues) => {
    if (data.newPassword !== data.confirmPassword) {
        toast.error("Password baru dan konfirmasi tidak cocok.");
        return;
    }
    const success = await changePassword(data.oldPassword, data.newPassword);
    if (!success) {
        toast.error("Password lama salah. Silakan coba lagi.");
        return;
    }

    toast.success("Password berhasil diubah, silakan login kembali.");
    reset();
    logout();
    router.push("/login");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow max-w-2lg sm:p-8">
        <h2 className="text-xl font-bold mb-4">Ubah Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password Lama
                </label>
                <input
                    type={showOldPassword ? "text" : "password"}
                    {...register("oldPassword", { required: true })}
                    className="w-full rounded-lg border px-3 py-3 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 pr-10 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    placeholder="Masukkan password lama"
                />
                <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute top-[39px] right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    tabIndex={-1}
                    aria-label={showOldPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                    {showOldPassword ? <EyeOff /> : <Eye />}
                </button>
            </div>

            {/* Password Baru dengan strength indicator */}
            <PasswordInput
                label="Password Baru"
                value={newPassword || ""}
                onChange={(val) => setValue("newPassword", val)}
                placeholder="Minimal 8 karakter"
            />

            {/* Konfirmasi Password */}
            <PasswordInput
                label="Konfirmasi Password"
                value={confirmPassword || ""}
                onChange={(val) => setValue("confirmPassword", val)}
                placeholder="Ulangi password baru"
            />
            {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-xs text-red-500">Konfirmasi password tidak cocok</p>
            )}

            {/* Tombol */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-10">
                <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="w-full sm:w-[180px] bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                    Kembali
                </button>
                <button
                    type="submit"
                    className="w-full sm:w-[180px] bg-green-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Simpan Perubahan
                </button>
            </div>
        </form>
    </div>
  );
}
