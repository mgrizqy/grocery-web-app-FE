"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/ui/GoogleBtn";

export default function LoginPage() {
  const { login, loading, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      const token = localStorage.getItem("token");
      if (token) {
        if (rememberMe) {
          localStorage.setItem("token", token);
          sessionStorage.removeItem("token");
        } else {
          sessionStorage.setItem("token", token);
          localStorage.removeItem("token");
        }
      }
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 dark:bg-gray-900">
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

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2 dark:text-gray-200">
          Selamat Datang Kembali
        </h2>
        <p className="text-center text-gray-500 mb-6 dark:text-gray-300">
          Masuk ke akun Groceria Anda untuk melanjutkan belanja
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1 dark:text-gray-200">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi Anda"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500 text-sm"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Error message */}
          <p className="text-red-500 text-sm mt-2">{error}</p>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />{" "}
              Ingat saya
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-green-600 hover:underline"
            >
              Lupa kata sandi?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>

        {/* Garis pembatas */}
        <div className="flex items-center gap-2 my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="text-gray-400 text-sm">ATAU</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Login Sosial */}
        <div className="flex gap-4 justify-center">
          <GoogleLoginButton />
        </div>

        <p className="text-center text-sm text-gray-600 mt-6 dark:text-gray-200">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-green-600 font-medium hover:underline cursor-pointer"
          >
            Daftar gratis
          </Link>
        </p>

        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:underline dark:text-gray-200"
          >
            ← Kembali berbelanja
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
