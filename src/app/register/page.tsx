"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/ui/GoogleBtn";

export default function RegisterPage() {
    const { register, loading, error } = useAuthStore();
    const [form, setForm] = useState({ first_name: "", last_name: "", email: "" });
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await register(form);
        
        if (success) {
            router.push("/check-email");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg dark:bg-gray-800"
            >
                <div className="flex justify-center my-6">
                    <Image
                        src="/assets/logo-short.svg"
                        alt="Logo"
                        width={70}
                        height={70}
                        priority
                    />
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
                    Buat Akun Baru
                </h2>
                <p className="text-center text-gray-500 mb-6">
                    Daftar untuk mulai berbelanja di Groceria
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {["first_name", "last_name", "email"].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                {field === "first_name"
                                    ? "Nama Depan"
                                    : field === "last_name"
                                    ? "Nama Belakang"
                                    : "Email"}
                            </label>
                            <input
                                type={field === "email" ? "email" : "text"}
                                name={field}
                                value={form[field as keyof typeof form]}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                                placeholder={`Masukkan ${field}`}
                                required
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    >
                        {loading ? "Mendaftar..." : "Daftar"}
                    </button>
                </form>

                {error && <p className="text-red-500 text-sm mt-2 dark:text-gray-200">{error}</p>}

                <div className="flex items-center gap-2 my-6">
                    <hr className="flex-grow border-gray-300" />
                    <span className="text-gray-400 text-sm dark:text-gray-200">ATAU</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                <div className="flex gap-4 justify-center">
                    <GoogleLoginButton/>
                </div>

                <p className="text-center text-sm text-gray-600 mt-6 dark:text-gray-200">
                    Sudah punya akun?{" "}
                    <Link href="/login" className="text-green-600 font-medium hover:underline ">
                        Masuk sekarang
                    </Link>
                </p>

                <div className="text-center mt-4">
                    <Link href="/" className="text-sm text-gray-500 hover:underline dark:text-gray-200">
                        ← Kembali berbelanja
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}