"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import {
    Home,
    LayoutDashboard,
    BarChart2,
    ChevronLeft,
    ChevronRight,
    NotebookPen,
    LogOut
} from "lucide-react";

type MenuItem = {
    name: string;
    icon: any;
    href: string;
};

const menu: MenuItem[] = [
    { name: "Beranda", icon: Home, href: "/mahasiswa/dashboard" },
    { name: "Pengajuan surat", icon: NotebookPen, href: "/mahasiswa/pengajuan-surat" },
    { name: "Status Surat", icon: LogOut, href: "/mahasiswa/status-surat" },
];


export default function Sidebar() {
    const [open, setOpen] = useState(true);
    const [userData, setUserData] = useState({
        name: "User",
        role: "Mahasiswa"
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserData({
                name: user.name || user.username || "User",
                role: user.role || "Mahasiswa"
            });
        }
    }, []);

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

    return (
        <div className={`
        ${open ? "w-64" : "w-20"}
        transition-all duration-300
        shrink-0
    `}>
            <aside
                className={`
            fixed top-4 left-4 h-[calc(100vh-32px)]
            rounded-2xl
            bg-white
            shadow-lg
            flex flex-col justify-between
            transition-all duration-300
            overflow-hidden
            z-50
            ${open ? "w-64" : "w-20"}
        `}
            >
                {/* TOP */}
                <div>
                    {/* Logo + Toggle */}
                    <div className="flex items-center justify-between px-4 py-6">
                        <img src="/images/logo-ssmi.png" alt="Logo" className="max-h-12" />

                        <button
                            onClick={() => setOpen(!open)}
                            className="text-gray-500 hover:text-gray-800"
                        >
                            {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                        </button>
                    </div>

                    {/* Menu */}
                    <nav className="flex flex-col gap-1 px-2">
                        {menu.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="
                    flex items-center gap-3
                    px-3 py-2 rounded-xl
                    text-gray-600 text-sm
                    hover:bg-gray-100 hover:text-gray-900
                    transition
                "
                            >
                                <item.icon size={18} />
                                {open && <span>{item.name}</span>}
                            </Link>
                        ))}
                    </nav>

                </div>

                {/* BOTTOM - PROFILE */}
                <div className="px-4 py-4 mt-auto border-t border-gray-100 space-y-2">
                    <Link href="/mahasiswa/profile" className="block">
                        <div className="flex items-center gap-3 rounded-xl hover:bg-gray-100 p-2 transition cursor-pointer">
                            <img
                                src={avatarUrl}
                                alt="avatar"
                                className="w-9 h-9 rounded-full object-cover shadow-sm"
                            />

                            {open && (
                                <div className="flex flex-col text-sm items-start">
                                    <span className="font-medium text-gray-800 line-clamp-1">
                                        {userData.name}
                                    </span>
                                    <span className="text-gray-500 text-xs">
                                        {userData.role}
                                    </span>
                                </div>
                            )}
                        </div>
                    </Link>

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
