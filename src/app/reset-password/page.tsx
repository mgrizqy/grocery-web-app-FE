"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { useAuthStore } from "@/store/auth-store";
import PasswordInput from "@/components/PasswordInput";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { resetPassword, loading } = useAuthStore();
    const router = useRouter();
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Token tidak ditemukan.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Konfirmasi password tidak cocok.");
            return;
        }

        const success = await resetPassword(token, newPassword);

        if (success) {
            toast.success("Password berhasil direset! Silakan login.");
            setNewPassword("");
            router.push("/login");
        } else {
            toast.error("Gagal reset password. Token mungkin tidak valid.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg dark:bg-gray-800"
            >
                <div className="flex justify-center mb-6">
                    <Lock className="w-14 h-14 text-green-600" />
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2 dark:text-gray-200">
                    Reset Kata Sandi
                </h2>
                <p className="text-center text-gray-500 mb-6 dark:text-gray-300">
                    Masukkan kata sandi baru Anda untuk melanjutkan.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <PasswordInput
                            label="Password Baru"
                            value={newPassword}
                            onChange={setNewPassword}
                            placeholder="Minimal 8 karakter"
                        />
                    </div>

                    <div>
                        <PasswordInput
                            label="Konfirmasi Password"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            placeholder="Minimal 8 karakter"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {loading ? "Mengatur ulang..." : "Reset Password"}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6 dark:text-gray-300">
                    Kembali ke{" "}
                    <Link href="/login" className="text-green-600 font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </motion.div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
