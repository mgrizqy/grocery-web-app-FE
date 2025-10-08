"use client";

import Navbar from "@/components/layout/navbar";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export default function TermsPage() {
  return (
    <>
    <Navbar/>
    <main className="max-w-5xl mx-auto px-6 py-16 ">
      <div className="text-center mb-10">
        <DocumentTextIcon className="h-12 w-12 mx-auto text-green-600" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
          Syarat & Ketentuan
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Harap baca dengan seksama sebelum menggunakan layanan kami.
        </p>
      </div>

      <div className="space-y-5 text-gray-700 dark:text-gray-300 text-justify mx-auto">
        <p>
          1. Dengan menggunakan situs ini, Anda menyetujui semua syarat dan ketentuan yang berlaku.
        </p>
        <p>
          2. Anda wajib memberikan informasi yang benar dan valid saat melakukan pemesanan.
        </p>
        <p>
          3. Kami berhak menolak pesanan jika ditemukan pelanggaran atau indikasi penyalahgunaan.
        </p>
        <p>
          4. Produk yang dibeli hanya bisa dikembalikan jika terdapat kesalahan dari pihak kami.
        </p>
      </div>
    </main>
    </>
  );
}
