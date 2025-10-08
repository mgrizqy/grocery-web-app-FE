"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutSection() {
    return (
        <section className="bg-gray-50 py-16 dark:bg-gray-900" id="about">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
                        Tentang <span className="text-green-600">Groceria</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-100 leading-relaxed">
                        Groceria adalah platform belanja online yang menghadirkan 
                        pengalaman baru dalam membeli kebutuhan sehari-hari. 
                        Dengan jaringan toko dan tenant terpercaya, kami pastikan 
                        semua produk yang Anda beli segar, berkualitas, dan cepat sampai.
                    </p>

                    <ul className="space-y-3 text-gray-700 dark:text-gray-100">
                        <li className="flex items-center gap-2">
                            <span className="text-green-600 font-bold">✔</span>
                            Produk segar langsung dari sumbernya
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-600 font-bold">✔</span>
                            Pengiriman cepat ke lokasi Anda
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-600 font-bold">✔</span>
                            Harga bersahabat & transparan
                        </li>
                    </ul>

                    <motion.a
                        href="/about"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block px-6 py-3 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition"
                    >
                        Pelajari Lebih Lanjut
                    </motion.a>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex justify-center"
                >
                    <Image
                        src="/assets/about.jpg" 
                        alt="Orang pegang keranjang sayuran"
                        width={500}
                        height={500}
                        className="rounded-2xl shadow-lg"
                    />
                </motion.div>
            </div>
        </section>
    );
}
