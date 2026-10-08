"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIdleTimeout } from "../hooks/useIdleTimeout";
import { LogOut, AlertTriangle } from "lucide-react";

/** Timeout per role (dalam milidetik) sebelum warning muncul */
const IDLE_TIMEOUT_BY_ROLE: Record<string, number> = {
    pemohon:    20 * 60 * 1000, // 20 menit
    default:    15 * 60 * 1000, // 15 menit
};

const WARNING_DURATION = 60 * 1000; // 1 menit

export default function IdleLogoutProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [showWarning, setShowWarning] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [userRole, setUserRole] = useState<string>("default");

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            const user = JSON.parse(stored);
            setUserRole(user.role || "default");
        }
    }, []);

    const doLogout = useCallback(async () => {
        setShowWarning(false);
        try {
            const token = localStorage.getItem("token");
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            await fetch(`${baseUrl}/api/auth/logout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
        } catch (_) {
            // Gagal request logout tetap bersihkan session lokal
        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    }, [router]);

    const handleIdle = useCallback(() => {
        setShowWarning(true);
        setCountdown(60);
    }, []);

    const handleActive = useCallback(() => {
        setShowWarning(false);
    }, []);

    const idleTime =
        IDLE_TIMEOUT_BY_ROLE[userRole] ?? IDLE_TIMEOUT_BY_ROLE.default;

    useIdleTimeout({
        idleTime,
        warningTime: WARNING_DURATION,
        onIdle: handleIdle,
        onActive: handleActive,
        onLogout: doLogout,
    });

    // Countdown timer saat modal warning tampil
    useEffect(() => {
        if (!showWarning) return;
        setCountdown(60);
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [showWarning]);

    return (
        <>
            {children}

            {/* Warning Modal */}
            {showWarning && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    {/* Backdrop blur */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    {/* Modal */}
                    <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4 flex flex-col items-center gap-5 animate-in fade-in zoom-in-95 duration-300">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
                            <AlertTriangle className="text-orange-500" size={32} />
                        </div>

                        {/* Title */}
                        <div className="text-center">
                            <h2 className="text-lg font-bold text-gray-900">
                                Sesi Hampir Berakhir
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Anda tidak aktif. Sistem akan logout otomatis dalam:
                            </p>
                        </div>

                        {/* Countdown */}
                        <div className="flex flex-col items-center gap-1">
                            <span
                                className={`text-5xl font-bold tabular-nums transition-colors duration-300 ${
                                    countdown <= 10 ? "text-red-500" : "text-orange-500"
                                }`}
                            >
                                {countdown}
                            </span>
                            <span className="text-xs text-gray-400">detik</span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${
                                    countdown <= 10 ? "bg-red-500" : "bg-orange-500"
                                }`}
                                style={{ width: `${(countdown / 60) * 100}%` }}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex w-full gap-3">
                            <button
                                onClick={doLogout}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                            >
                                <LogOut size={15} />
                                Logout Sekarang
                            </button>
                            <button
                                onClick={() => {
                                    setShowWarning(false);
                                }}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition shadow-sm"
                            >
                                Tetap Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
