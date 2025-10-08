import { useAuthStore } from "@/store/auth-store";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";

export default function DashboardProtection({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, setUserAndToken, clearAuth } = useAuthStore();
  const { fetchProfile } = useUserStore();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedTokenSession = sessionStorage.getItem("token");
        const savedTokenLocalStorage = localStorage.getItem("token");
        if (!savedTokenSession && !savedTokenLocalStorage) {
          router.replace("/login");
          return;
        }
        let currentUser = user;
        const savedToken = savedTokenSession || savedTokenLocalStorage;
        if (!savedToken) {
          router.replace("/login");
          return;
        }

        if (!currentUser) {
          const profile = await fetchProfile();
          if (!profile) {
            clearAuth();
            router.push("/login");
            return;
          }
          setUserAndToken(profile, savedToken);
          currentUser = profile;
        }
        if (user.role !== "STORE_ADMIN" && user.role !== "SUPER_ADMIN") {
          alert("Access Forbidden");
          router.push("/login");
          return;
        }
      } catch (error) {
        console.log(error);
        clearAuth();
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
  }, [user, fetchProfile, setUserAndToken, clearAuth, router]);

  if (checking) return <LoadingScreen />;
  if (!user) return null;
  return <>{children}</>;
}
