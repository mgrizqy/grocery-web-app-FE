"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MailCheck } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useAuthStore } from "@/store/auth-store";

export default function VerifyNewEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { verifyNewEmail } = useAuthStore();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        toast.error("Token tidak ditemukan.");
        return;
      }

      const success = await verifyNewEmail(token);
      if (success) {
        setStatus("success");
        setTimeout(() => router.push("/pengaturan"), 2000);
      } else {
        setStatus("error");
        toast.error("Verifikasi email gagal.");
      }
    };

    verify();
  }, [token, verifyNewEmail, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center"
      >
        <div className="flex justify-center mb-4">
          <MailCheck className="w-12 h-12 text-green-600" />
        </div>

        {status === "loading" && (
          <>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Sedang memverifikasi...
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Mohon tunggu sebentar.
            </p>
          </>
        )}

        {status === "success" && (
            <>
                <h2 className="text-xl font-bold text-green-600">
                    Email berhasil diverifikasi 🎉
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Email barumu sudah aktif.
                </p>
            </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-xl font-bold text-red-600">
              Verifikasi gagal
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Token mungkin sudah kedaluwarsa. Silakan minta verifikasi ulang.
            </p>
          </>
        )}
      </motion.div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
