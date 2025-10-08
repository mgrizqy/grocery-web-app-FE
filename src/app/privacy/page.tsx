"use client";

import Navbar from "@/components/layout/navbar";
import { LockClosedIcon } from "@heroicons/react/24/outline";

export default function PrivacyPolicyPage() {
  return (
    <>
    <Navbar/>
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <LockClosedIcon className="h-12 w-12 mx-auto text-purple-600" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
          Kebijakan Privasi
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Privasi Anda adalah prioritas kami.
        </p>
      </div>

      <div className="space-y-5 text-gray-700 dark:text-gray-300 text-justify">
        <p>
          Kami mengumpulkan data pribadi Anda hanya untuk keperluan layanan dan pengiriman.
        </p>
        <p>
          Informasi Anda tidak akan dibagikan kepada pihak ketiga tanpa izin, kecuali diwajibkan oleh hukum.
        </p>
        <p>
          Kami menggunakan cookie untuk meningkatkan pengalaman pengguna di website ini.
        </p>
        <p>
          Anda dapat menghubungi kami kapan saja untuk permintaan penghapusan data atau pertanyaan lainnya.
        </p>
      </div>
    </main>
    </>
  );
}
