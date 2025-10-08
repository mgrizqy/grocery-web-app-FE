"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

interface PasswordInputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function PasswordInput({
    label = "Password",
    value,
    onChange,
    placeholder = "Masukkan password",
}: PasswordInputProps) {
    const [show, setShow] = useState(false);

    // Hitung strength
    const calculateStrength = (password: string) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
        return score;
    };

    const strength = calculateStrength(value);

    const getStrengthLabel = () => {
        if (strength <= 1) return "Lemah";
        if (strength === 2 || strength === 3) return "Sedang";
        return "Kuat";
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <div className="relative mt-1">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-lg border px-3 py-3 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 mb-3"
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 mb-3"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {value && (
                <p
                    className={clsx(
                        "mt-1 text-xs font-semibold",
                        strength <= 1 && "text-red-500",
                        strength === 2 && "text-yellow-500",
                        strength === 3 && "text-blue-500",
                        strength >= 4 && "text-green-600"
                    )}
                >
                    Kekuatan: {getStrengthLabel()}
                </p>
            )}
        </div>
    );
}
