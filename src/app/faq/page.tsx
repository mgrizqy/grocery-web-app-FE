"use client";

import Navbar from "@/components/layout/navbar";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "Bagaimana cara memesan produk?",
    answer:
      "Tambahkan produk ke keranjang, isi data pengiriman, lalu lanjut ke pembayaran.",
  },
  {
    question: "Apakah bisa mengembalikan barang?",
    answer:
      "Bisa. Jika produk tidak layak konsumsi, silakan hubungi kami dalam 1x24 jam.",
  },
  {
    question: "Berapa lama pengiriman?",
    answer: "1-2 hari kerja, tergantung lokasi dan ketersediaan kurir.",
  },
];

export default function FAQPage() {
  return (
    <>
    <Navbar/>
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <QuestionMarkCircleIcon className="h-12 w-12 mx-auto text-green-600" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Temukan jawaban dari pertanyaan umum seputar layanan kami.
        </p>
      </div>

      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {faq.question}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mt-2">{faq.answer}</p>
          </div>
        ))}
      </div>
    </main>
    </>
  );
}
