"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const trimmedIdentifier = identifier.trim();
            const isEmail = trimmedIdentifier.includes("@");
            
            const loginData = isEmail
                ? { email: trimmedIdentifier, password, }
                : { username: trimmedIdentifier, password, };

            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });

            const data = await res.json();

            if (res.ok) {
                const token = data.token || data.access_token;
                if (token) localStorage.setItem("token", token);
                if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

                const role = data.user?.role?.toLowerCase();

                const routes: Record<string, string> = {
                    pemohon: "/umum/dashboard",
                    sekretariat: "/umum/dashboard",
                    kabag_tu: "/umum/dashboard",
                    wakil_dekan: "/umum/dashboard",
                    dekan: "/umum/dashboard",
                    superadmin: "/umum/users"
                };

                if (routes[role]) {
                    router.push(routes[role]);
                } else {
                    console.log("Role received:", role);
                    setError("Role (" + role + ") tidak dikenali atau belum memiliki dashboard.");
                }
            } else {
                setError(data.message || "Login gagal.");
            }
        } catch (err) {
            setError("Gagal terhubung ke server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[60%_40%] bg-slate-50">

            {/* LEFT - BACKGROUND IMAGE */}
            <div className="hidden md:block relative overflow-hidden">
                <Image
                    src="/images/bg-login.jpg"
                    alt="Background"
                    fill
                    className="object-cover brightness-75 hover:scale-105 transition-transform duration-1000"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12 text-white">
                    <div className="backdrop-blur-sm bg-white/10 p-8 rounded-3xl border border-white/20 max-w-xl">
                        <h2 className="text-4xl font-bold mb-4 italic leading-tight">Sistem Persuratan Digital</h2>
                        <p className="text-lg opacity-90 leading-relaxed">
                            Solusi modern untuk efisiensi administrasi persuratan Anda. Kelola surat menyurat dengan lebih terintegrasi dan transparan.
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT - LOGIN FORM */}
            <div className="flex items-center justify-center p-6 md:p-12 lg:p-20">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 text-white mb-6 shadow-xl shadow-orange-200 rotate-3 hover:rotate-0 transition-transform duration-300">
                            <Mail className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                            Selamat Datang Kembali 👋
                        </h1>
                        <p className="text-gray-500 font-medium">
                            Silakan masuk ke akun Anda untuk melanjutkan
                        </p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] p-10 border border-gray-100 relative overflow-hidden group animate-fade-in">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500"></div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6 relative">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username atau Email</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-orange-500 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Username atau email"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                                    <button type="button" className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors uppercase tracking-widest">
                                        Lupa?
                                    </button>
                                </div>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-orange-500 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold shadow-xl shadow-orange-200 hover:bg-orange-700 hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    "Masuk ke Dashboard"
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-sm">
                                Belum punya akun?{" "}
                                <Link href="/register" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
                                    Daftar sekarang
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 text-center flex flex-col items-center gap-4">
                        <p className="text-sm text-gray-400 font-medium">
                            © 2026 SSMI • v1.0.0
                        </p>
                        <div className="flex gap-6 mt-2">
                            <a href="#" className="text-xs font-bold text-gray-400 hover:text-orange-600 transition-colors uppercase tracking-widest">Bantuan</a>
                            <a href="#" className="text-xs font-bold text-gray-400 hover:text-orange-600 transition-colors uppercase tracking-widest">Privasi</a>
                            <a href="#" className="text-xs font-bold text-gray-400 hover:text-orange-600 transition-colors uppercase tracking-widest">Ketentuan</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
