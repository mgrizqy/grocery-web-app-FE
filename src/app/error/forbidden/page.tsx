"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-50 p-6 text-center">
      {/* SVG Illustration */}
        <div className="mb-6">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="220"
                height="220"
                viewBox="0 0 24 24"
                className="mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
        </div>

      {/* Text */}
        <h1 className="text-6xl font-extrabold text-red-600 mb-2">403</h1>
        <h2 className="text-2xl font-semibold mb-4">Akses Ditolak</h2>
        <p className="text-gray-600 max-w-md mb-6">
            Ups! Anda tidak memiliki izin untuk membuka halaman ini.
            Coba kembali ke beranda atau login ulang dengan akun yang sesuai.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
            <Link href="/">
                <Button className="rounded-2xl shadow-md">Kembali ke Beranda</Button>
            </Link>
            <Link href="/auth/login">
                <Button variant="outline" className="rounded-2xl">
                    Login Ulang
                </Button>
            </Link>
        </div>
    </div>
  );
}
