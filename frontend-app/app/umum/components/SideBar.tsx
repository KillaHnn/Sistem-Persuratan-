"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FilePlus2,
    ClipboardList,
    Bell,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Menu,
    X,
    Users,
} from "lucide-react";

type MenuItem = {
    name: string;
    icon: any;
    href: string;
    role?: string;
};

const menu: MenuItem[] = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/umum/dashboard" },
    { name: "Buat Surat", icon: FilePlus2, href: "/umum/buat-surat" },
    { name: "Riwayat Surat", icon: ClipboardList, href: "/umum/riwayat" },
    { name: "Buku Register", icon: ClipboardList, href: "/umum/buku-register", role: "sekretariat" },
    { name: "Notifikasi", icon: Bell, href: "/umum/notifikasi" },
    { name: "Manajemen User", icon: Users, href: "/umum/users", role: "superadmin" },
];

export default function Sidebar() {
    const [open, setOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const [userData, setUserData] = useState({
        name: "User",
        role: "Pemohon",
        unit_kerja: "",
    });
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserData({
                name: user.name || user.username || "User",
                role: user.role || "Pemohon",
                unit_kerja: user.unit_kerja || "",
            });
        }
        // Fetch unread notif count
        fetchUnreadCount();

        // Refresh badge saat user kembali ke tab
        const handleVisibility = () => {
            if (document.visibilityState === "visible") fetchUnreadCount();
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, []);

    // Tutup mobile drawer saat halaman berpindah
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const res = await fetch(`${baseUrl}/api/umum/notifikasi`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
            if (res.ok) {
                const data = await res.json();
                setUnreadCount(data.unread_count ?? 0);
            }
        } catch (_) {}
    };

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", { method: "POST" });
            if (res.ok) {
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=ea580c&color=fff&size=64`;

    const roleLabel: Record<string, string> = {
        pemohon: "Pemohon",
        sekretariat: "Sekretariat",
        kabag_tu: "Kabag TU",
        wakil_dekan: "Wakil Dekan",
        dekan: "Dekan",
        superadmin: "Superadmin",
    };

    const navItems = menu.filter(item => !item.role || item.role === userData.role);

    return (
        <>
            {/* TOP HEADER BAR FOR MOBILE */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 flex items-center justify-between z-40 shadow-xs">
                <div className="flex items-center gap-3">
                    <img src="/images/logo-ssmi.png" alt="Logo" className="h-9" />
                </div>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* MOBILE BACKDROP OVERLAY */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 animate-in fade-in duration-200"
                />
            )}

            {/* MOBILE DRAWER */}
            <aside
                className={`
                    md:hidden fixed top-0 left-0 bottom-0 w-72 bg-white z-50
                    flex flex-col justify-between p-4 shadow-2xl transition-transform duration-300 ease-in-out
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <div>
                    <div className="flex items-center justify-between py-4 border-b border-gray-100 mb-4 px-2">
                        <img src="/images/logo-ssmi.png" alt="Logo" className="h-10" />
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="px-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            Menu Utama
                        </span>
                    </div>

                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`
                                        relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium
                                        transition-all duration-200
                                        ${isActive
                                            ? "bg-orange-50 text-orange-600 font-semibold"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        }
                                    `}
                                >
                                    {isActive && (
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-500 rounded-r-full" />
                                    )}
                                    <item.icon size={20} />
                                    <span className="flex-1 flex items-center justify-between">
                                        {item.name}
                                        {item.name === "Notifikasi" && unreadCount > 0 && (
                                            <span className="ml-auto bg-orange-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="py-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center gap-3 rounded-xl p-2 bg-gray-50/80">
                        <img
                            src={avatarUrl}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover shadow-xs shrink-0"
                        />
                        <div className="flex flex-col text-sm items-start min-w-0">
                            <span className="font-semibold text-gray-800 truncate w-full">
                                {userData.name}
                            </span>
                            <span className="text-gray-500 text-xs">
                                {roleLabel[userData.role] || userData.role}
                            </span>
                            {userData.unit_kerja && (
                                <span className="text-gray-400 text-[10px] truncate w-full">
                                    {userData.unit_kerja}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 text-sm font-medium hover:bg-red-50 transition"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* DESKTOP SIDEBAR */}
            <div className={`hidden md:block ${open ? "w-64" : "w-20"} transition-all duration-300 shrink-0`}>
                <aside
                    className={`
                        fixed top-4 left-4 h-[calc(100vh-32px)]
                        rounded-2xl bg-white shadow-lg
                        flex flex-col justify-between
                        transition-all duration-300 overflow-hidden z-30
                        ${open ? "w-64" : "w-20"}
                    `}
                >
                    {/* TOP */}
                    <div>
                        {/* Logo + Toggle */}
                        <div className="flex items-center justify-between px-4 py-6">
                            {open && <img src="/images/logo-ssmi.png" alt="Logo" className="max-h-12" />}
                            <button
                                onClick={() => setOpen(!open)}
                                className="text-gray-500 hover:text-gray-800 ml-auto p-1 rounded-lg hover:bg-gray-100 transition"
                            >
                                {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                            </button>
                        </div>

                        {/* Divider label */}
                        {open && (
                            <div className="px-4 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    Menu Utama
                                </span>
                            </div>
                        )}

                        {/* Menu */}
                        <nav className="flex flex-col gap-1 px-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`
                                            relative flex items-center gap-3
                                            px-3 py-2.5 rounded-xl text-sm
                                            transition-all duration-200
                                            ${isActive
                                                ? "bg-orange-50 text-orange-600 font-semibold"
                                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                            }
                                        `}
                                    >
                                        {isActive && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-500 rounded-r-full" />
                                        )}
                                        <item.icon size={18} />
                                        {open && (
                                            <span className="flex-1 flex items-center justify-between">
                                                {item.name}
                                                {item.name === "Notifikasi" && unreadCount > 0 && (
                                                    <span className="ml-auto bg-orange-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* BOTTOM - PROFILE */}
                    <div className="px-4 py-4 mt-auto border-t border-gray-100 space-y-2">
                        <div className="flex items-center gap-3 rounded-xl p-2">
                            <img
                                src={avatarUrl}
                                alt="avatar"
                                className="w-9 h-9 rounded-full object-cover shadow-xs shrink-0"
                            />
                            {open && (
                                <div className="flex flex-col text-sm items-start min-w-0">
                                    <span className="font-medium text-gray-800 truncate w-full">
                                        {userData.name}
                                    </span>
                                    <span className="text-gray-500 text-xs">
                                        {roleLabel[userData.role] || userData.role}
                                    </span>
                                    {userData.unit_kerja && (
                                        <span className="text-gray-400 text-[10px] truncate w-full">
                                            {userData.unit_kerja}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 text-sm hover:bg-red-50 transition"
                        >
                            <LogOut size={18} />
                            {open && <span className="font-medium">Logout</span>}
                        </button>
                    </div>
                </aside>
            </div>
        </>
    );
}
