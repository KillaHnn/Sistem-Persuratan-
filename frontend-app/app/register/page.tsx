"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, User, AtSign } from "lucide-react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                const token = data.token || data.access_token;
                if (token) localStorage.setItem("token", token);
                if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

                // Automatis redirect ke dashboard karena role defaultnya pemohon
                router.push("/umum/dashboard");
            } else {
                setError(data.message || "Registrasi gagal.");
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
                            Mulai digitalisasi surat menyurat Anda. Buat akun sekarang untuk mengajukan surat dengan mudah.
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT - REGISTER FORM */}
            <div className="flex items-center justify-center p-6 md:p-12 lg:p-20 overflow-y-auto h-screen">
                <div className="w-full max-w-md my-auto pb-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 text-white mb-6 shadow-xl shadow-orange-200 rotate-3 hover:rotate-0 transition-transform duration-300">
                            <User className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                            Buat Akun Baru
                        </h1>
                        <p className="text-gray-500 font-medium">
                            Isi form di bawah ini untuk mendaftar sebagai Pemohon.
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
                        <form onSubmit={handleSubmit} className="space-y-5 relative">
                            {/* Nama Lengkap */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-orange-500 transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Nama Lengkap"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-orange-500 transition-colors">
                                        <AtSign className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-orange-500 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Alamat Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within/input:text-orange-500 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
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
                                className="w-full py-4 mt-2 bg-orange-600 text-white rounded-2xl font-bold shadow-xl shadow-orange-200 hover:bg-orange-700 hover:shadow-orange-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Mendaftarkan...
                                    </>
                                ) : (
                                    "Daftar Sekarang"
                                )}
                            </button>
                            
                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-500 font-medium">
                                    Sudah punya akun? <Link href="/login" className="text-orange-600 font-bold hover:underline">Masuk</Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    <div className="mt-8 text-center flex flex-col items-center gap-4">
                        <p className="text-sm text-gray-400 font-medium">
                            © 2026 SSMI • v1.0.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
