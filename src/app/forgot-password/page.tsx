"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { useAuthStore } from "@/store/auth-store";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const { requestPasswordReset, loading } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await requestPasswordReset(email);
        if (success) {
            toast.success("Link reset password sudah dikirim ke email Anda.");
        } else {
            toast.error("Email salah atau belum terdaftar.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 dark:bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg dark:bg-gray-800"
            >
                <div className="flex justify-center mb-6">
                    <Image
                        src="/assets/logo-short.svg"
                        alt="Logo"
                        width={70}
                        height={70}
                        priority
                    />
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2 dark:text-gray-200">
                    Lupa Kata Sandi?
                </h2>
                <p className="text-center text-gray-500 mb-6 dark:text-gray-300">
                    Masukkan email Anda dan kami akan mengirimkan link untuk mereset kata sandi.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm mb-1 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Masukkan email Anda"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {loading ? "Mengirim..." : "Kirim Link Reset"}
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
