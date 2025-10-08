"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const features = [
    {
        title: "Harga terbaik",
        description: "Harga terbaik karena buah/sayuran langsung didapatkan dari petani",
        icon: "/assets/icon-1.png",
    },
    {
        title: "Bebas pengembalian",
        description: "Jika terdapat sayuran atau buah yang kurang layak, bisa dikembalikan tanpa biaya tambahan.",
        icon: "/assets/refund.png",
    },
    {
        title: "Gratis Ongkir",
        description: "Minimal pembelian 50ribu dan dapatkan gratis ongkir kemanapun",
        icon: "/assets/free-ongkir.png",
    },
];

export default function FeaturesSection() {
    return (
        <section className="bg-white py-16 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center space-y-4"
                    >
                        <div className="w-14 h-14 flex items-center justify-center">
                            <Image
                                src={feature.icon}
                                alt={feature.title}
                                width={56}
                                height={56}
                                className="object-contain"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-100 text-sm">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
