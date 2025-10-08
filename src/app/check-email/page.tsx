"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { MailCheck, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "@/store/auth-store";

export default function CheckEmailPage() {
  const { user } = useAuthStore();
  const email = user.email || ""; // tidak perlu setEmail karena tidak ada perubahan
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const resendVerification = async () => {
    if (countdown > 0) return;
    setResending(true);
    setMessage("");
    try {
      const res = await apiCall.post("/api/auth/resent-regist", { email });
      toast.success(res.data.message || "Email verifikasi sudah dikirim ulang");
      setCountdown(60);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as any).response?.data?.message === "string"
      ) {
        toast.error((err as any).response.data.message);
      } else {
        toast.error("Gagal mengirim ulang email");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center dark:bg-gray-800"
      >
        <div className="flex justify-center mb-6">
          <MailCheck className="w-14 h-14 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-200">
          Silahkan cek email anda
        </h2>
        <p className="text-gray-500 mb-6 dark:text-gray-300">
          Kami sudah mengirim link verifikasi ke email Anda. Klik link tersebut
          untuk mengaktifkan akun.
        </p>

        <button
          onClick={resendVerification}
          disabled={resending || countdown > 0}
          className="flex items-center justify-center gap-2 w-full rounded-lg border border-green-600 bg-green-600 text-gray-100 px-4 py-2 font-semibold shadow-sm hover:bg-green-50 hover:text-green-600 disabled:opacity-50"
        >
          <RefreshCcw className="w-4 h-4" />
          {resending
            ? "Mengirim ulang..."
            : countdown > 0
            ? `Tunggu ${countdown}s`
            : "Kirim ulang verifikasi email"}
        </button>

        {message && <p className="text-sm text-green-600 mt-3">{message}</p>}

        <div className="mt-6">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:underline dark:text-gray-300"
          >
            ← Kembali berbelanja
          </Link>
        </div>
      </motion.div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
