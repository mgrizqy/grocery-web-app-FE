"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const promo = [
    { id: 1, title: "", img: "/banner/banner.png" },
    { id: 2, title: "Vegetables Sale", img: "/banner/banner-2.png" },
    { id: 3, title: "Weekly Special Offers", img: "/banner/banner-3.png" },
];

export default function HeroCarousel() {
    const [index, setIndex] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % promo.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative max-w-7xl mx-auto px-6 py-3 flex items-center h-56 sm:h-72 md:h-96 overflow-hidden rounded-2xl mt-5">
            <AnimatePresence mode="wait">
                <motion.img
                    key={promo[index].id}
                    src={promo[index].img}
                    alt={promo[index].title}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="w-full h-full object-center rounded-2xl sm:h-72 md:h-96"
                />
            </AnimatePresence>

        {/* Overlay teks */}
            {/* <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <motion.h2
                    key={promo[index].title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5 }}
                    className="text-white text-lg sm:text-2xl md:text-3xl font-bold px-4 text-center"
                >
                    {promo[index].title}
                </motion.h2>
            </div> */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {promo.map((_, i) => (
                <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                    i === index ? "bg-green-600 scale-110" : "bg-gray-400"
                    }`}
                />
                ))}
            </div>
        </div>
    );
}
