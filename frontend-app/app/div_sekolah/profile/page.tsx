"use client";

import { useState, useEffect } from "react";
import {
    User,
    Mail,
    Briefcase,
    Building2,
    Camera,
    ShieldCheck,
    Save,
    KeyRound,
    AlertCircle,
    CheckCircle2,
    X
} from "lucide-react";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        department: "Division Sekolah",
        username: "",
        bio: "School administration representative managing institutional correspondence.",
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setFormData(prev => ({
                ...prev,
                name: user.name || user.username || "Staff Sekolah",
                email: user.email || "-",
                role: user.role || "div_sekolah",
                username: user.username || ""
            }));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            localStorage.setItem("user", JSON.stringify({
                ...JSON.parse(localStorage.getItem("user") || "{}"),
                name: formData.name,
                email: formData.email
            }));
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("Password baru tidak cocok.");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError("Password minimal 6 karakter.");
            return;
        }

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setPasswordSuccess("Password berhasil diubah!");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(() => setShowPasswordModal(false), 2000);
        } catch (error) {
            setPasswordError("Gagal mengubah password. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            {/* Banner Section */}
            <div className="h-48 bg-gradient-to-r from-emerald-600 to-teal-700 relative">
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Left Column - Profile Card */}
                    <div className="w-full md:w-1/3 flex flex-col gap-6">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="p-6 flex flex-col items-center text-center">
                                <div className="relative mb-4 group">
                                    <div className="w-32 h-32 rounded-full p-1 bg-white shadow-lg">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=059669&color=fff&size=128`}
                                            alt="avatar"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                    <button className="absolute bottom-1 right-1 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition shadow-md group-hover:scale-110">
                                        <Camera size={16} />
                                    </button>
                                </div>

                                <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 mt-2 uppercase">
                                    <Briefcase size={12} />
                                    {formData.role.replace('_', ' ')}
                                </span>

                                <p className="text-gray-500 text-sm mt-3 px-4">
                                    {formData.bio}
                                </p>

                                <div className="w-full mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Status</span>
                                        <span className="text-green-600 font-medium flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            Aktif
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Username</span>
                                        <span className="text-gray-900">{formData.username}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Security Card */}
                        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                <ShieldCheck size={18} className="text-emerald-600" />
                                Keamanan Akun
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition text-sm text-gray-700 border border-transparent hover:border-emerald-100"
                                >
                                    <span className="flex items-center gap-2">
                                        <KeyRound size={16} className="text-emerald-500" />
                                        Ubah Password
                                    </span>
                                    <span className="text-xs text-emerald-600 font-medium">Update</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Edit Form */}
                    <div className="w-full md:w-2/3">
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Profil Divisi Sekolah</h1>
                                    <p className="text-gray-500 text-sm mt-1">Kelola data diri dan informasi akun</p>
                                </div>
                                {/* {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition"
                                    >
                                        Edit Profil
                                    </button>
                                )} */}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 block">Nama Lengkap</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="name"
                                                disabled={!isEditing}
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' : 'border-transparent bg-gray-50 text-gray-600'} transition-all`}
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 block">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                name="email"
                                                disabled={!isEditing}
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' : 'border-transparent bg-gray-50 text-gray-600'} transition-all`}
                                            />
                                        </div>
                                    </div>

                                    {/* Department */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 block">Bagian / Unit</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="department"
                                                disabled={!isEditing}
                                                value={formData.department}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' : 'border-transparent bg-gray-50 text-gray-600'} transition-all`}
                                            />
                                        </div>
                                    </div>

                                    {/* Role (Read Only) */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 block">Peran (Role)</label>
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                value={formData.role}
                                                disabled
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-transparent bg-gray-50 text-gray-500 cursor-not-allowed uppercase"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 block">Bio</label>
                                    <textarea
                                        name="bio"
                                        rows={4}
                                        disabled={!isEditing}
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-xl border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' : 'border-transparent bg-gray-50 text-gray-600'} transition-all resize-none`}
                                    />
                                </div>

                                {/* Actions */}
                                {isEditing && (
                                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-medium transition flex items-center gap-2 shadow-lg shadow-emerald-200"
                                        >
                                            {loading ? 'Menyimpan...' : (
                                                <>
                                                    <Save size={18} />
                                                    Simpan Perubahan
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Ubah Password</h2>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                            {passwordError && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle size={16} />
                                    {passwordError}
                                </div>
                            )}
                            {passwordSuccess && (
                                <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2 text-green-600 text-sm">
                                    <CheckCircle2 size={16} />
                                    {passwordSuccess}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Password Sekarang</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Password Baru</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {loading ? "Memproses..." : "Simpan Password Baru"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="w-full py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-all"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
