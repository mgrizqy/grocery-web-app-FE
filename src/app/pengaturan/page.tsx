"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import ProfileForm from "./profile-form";
import AddressForm from "./address-form";
import PasswordForm from "./password-form";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useAuthStore } from "@/store/auth-store"; // pastikan ini mengandung { user, hydrate }
import { toast } from "react-toastify";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "address" | "password">("profile");
  const { user, hydrate } = useAuthStore();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (user === null) {
      router.replace("/");
      toast.error("User belum terdaftar/terverifikasi");
    } else {
      setCheckingAuth(false);
    }
  }, [user, router]);

  if (checkingAuth) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full flex-shrink-0">
        <Navbar />
      </div>

      {/* Konten utama */}
      <div className="flex-1 max-w-7xl mx-auto p-6 w-full">
        <div className="flex gap-6">
          {/* Sidebar hanya muncul di desktop */}
          <aside className="hidden md:block w-64 sticky top-6 self-start h-fit">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </aside>

          {/* Konten */}
          <main className="flex-1">
            {/* Mobile Tabs */}
            <div className="md:hidden mb-4 flex justify-around border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === "profile"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("address")}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === "address"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500"
                }`}
              >
                Address
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === "password"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500"
                }`}
              >
                Password
              </button>
            </div>

            {/* Form aktif */}
            {activeTab === "profile" && <ProfileForm />}
            {activeTab === "address" && <AddressForm />}
            {activeTab === "password" && <PasswordForm />}
          </main>
        </div>
      </div>

      <div className="w-full flex-shrink-0">
        <Footer />
      </div>
    </div>
  );
}
