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
} from "lucide-react";

type MenuItem = {
    name: string;
    icon: any;
    href: string;
};

const menu: MenuItem[] = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/umum/dashboard" },
    { name: "Buat Surat", icon: FilePlus2, href: "/umum/buat-surat" },
    { name: "Riwayat Surat", icon: ClipboardList, href: "/umum/riwayat" },
    { name: "Notifikasi", icon: Bell, href: "/umum/notifikasi" },
];

export default function Sidebar() {
    const [open, setOpen] = useState(true);
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
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const res = await fetch("http://127.0.0.1:8000/api/umum/notifikasi?unread=true", {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
            if (res.ok) {
                const data = await res.json();
                setUnreadCount(data.total || 0);
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
    };

    return (
        <div className={`${open ? "w-64" : "w-20"} transition-all duration-300 shrink-0`}>
            <aside
                className={`
                    fixed top-4 left-4 h-[calc(100vh-32px)]
                    rounded-2xl bg-white shadow-lg
                    flex flex-col justify-between
                    transition-all duration-300 overflow-hidden z-50
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
                            className="text-gray-500 hover:text-gray-800 ml-auto"
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
                        {menu.map((item) => {
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
                            className="w-9 h-9 rounded-full object-cover shadow-sm shrink-0"
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
    );
}
