"use client";

import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

interface IFooterProps {
  className?: string;
}
export default function Footer({ className }: IFooterProps) {
  return (
    <footer className={`bg-white border-t dark:bg-gray-900 ${className}`} id="footer">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-green-600">Groceria</h2>
          <p className="text-gray-600 mt-2 dark:text-gray-100">
            Belanja kebutuhan harian lebih mudah, cepat, dan segar.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold mb-3">Menu</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-100">
            <li>
              <a href="/" className="hover:text-green-600">
                Beranda
              </a>
            </li>
            <li>
              <a href="/#products" className="hover:text-green-600">
                Produk
              </a>
            </li>
            <li>
              <a href="/#aboutus" className="hover:text-green-600">
                Tentang Kami
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-3">Bantuan</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-100">
            <li>
              <a href="/faq" className="hover:text-green-600">
                FAQ
              </a>
            </li>
            <li>
              <a href="/shipping" className="hover:text-green-600">
                Pengiriman
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-green-600">
                Kebijakan Privasi
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-green-600">
                Syarat & Ketentuan
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3">Hubungi Kami</h3>
          <p className="text-gray-600 dark:text-gray-100">
            Email: support@groceria.com
          </p>
          <div className="flex gap-3 mt-3">
            <a
              href="#"
              className="text-gray-500 dark:text-gray-100 hover:text-green-600"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="text-gray-500 dark:text-gray-100 hover:text-green-600"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="text-gray-500 dark:text-gray-100 hover:text-green-600"
            >
              <Twitter size={20} />
            </a>
            <a
              href="mailto:support@groceria.com"
              className="text-gray-500 dark:text-gray-100 hover:text-green-600"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t py-4 text-center text-gray-500 text-sm dark:text-gray-100">
        © {new Date().getFullYear()} Groceria. Semua Hak Dilindungi.
      </div>
    </footer>
  );
}
