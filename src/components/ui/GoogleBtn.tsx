"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

export default function GoogleLoginButton() {
    const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
    const router = useRouter();

    const handleCallbackResponse = async (response: any) => {
        if (!response?.credential) return;
        await loginWithGoogle(response.credential);
        router.push("/");
    };

    useEffect(() => {
        (window as any).handleCallbackResponse = handleCallbackResponse;

        const interval = setInterval(() => {
            if (window.google && document.getElementById("googleBtn")) {
                window.google.accounts.id.initialize({
                    client_id:  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                    callback: handleCallbackResponse,
                });

                window.google.accounts.id.renderButton(
                    document.getElementById("googleBtn"),
                    { theme: "outline", size: "large" }
                );
                    clearInterval(interval); 
                }
            }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
            />
                <div id="googleBtn" className="flex justify-center" />
        </>
    );
}
