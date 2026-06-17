"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    ChevronLeft,
    ChevronRight,
    NotebookPen,
    UserLock,
    LogOut,
    ChevronDown,
    FileDigit,
    FileText,
    Mail,
    Inbox,
    Archive,
    FolderTree
} from "lucide-react";

type SubMenuItem = {
    name: string;
    href: string;
};

type MenuItem = {
    name: string;
    icon: any;
    href?: string;
    subItems?: SubMenuItem[];
};

export default function Sidebar() {
    const [open, setOpen] = useState(true);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const [userData, setUserData] = useState({
        name: "Staff",
        role: "Staff Division",
        basePath: "/div_sekolah"
    });

    const pathname = usePathname();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            const role = user.role?.toLowerCase() || "div_sekolah";
            const basePath = role === "div_sekolah" ? "/div_sekolah" : "/div_prodi";

            setUserData({
                name: user.name || user.username || "Staff",
                role: role === "div_sekolah" ? "Division Sekolah" : "Division Prodi",
                basePath: basePath
            });
        }
    }, []);

    const bp = userData.basePath;

    const menu: MenuItem[] = [
        { name: "Beranda", icon: Home, href: `${bp}/dashboard` },
        {
            name: "Registrasi",
            icon: NotebookPen,
            subItems: [
                { name: "Nomor Surat", href: `${bp}/registrasi/nomor-surat` },
                { name: "Nomor Surat SK", href: `${bp}/registrasi/nomor-surat-sk` },
                { name: "Surat Keluar", href: `${bp}/registrasi/surat-keluar` },
                { name: "Surat Masuk", href: `${bp}/registrasi/surat-masuk` },
                { name: "Pemberkasan", href: `${bp}/registrasi/pemberkasan` },
                { name: "Klasifikasi Arsip", href: `${bp}/registrasi/klasifikasi-arsip` },
            ]
        },
        { name: "Pelayanan Surat", icon: FileText, href: `${bp}/pelayanan-surat` },

        {
            name: "Layanan S1",
            icon: FileText,
            subItems: [
                { name: "Surat Cuti", href: `${bp}/surat-cuti` },
                { name: "Surat Keluar", href: `${bp}/surat-keluar` },
                { name: "Surat Keterangan Aktif", href: `${bp}/surat-keterangan-aktif` },
                { name: "Surat Keterangan", href: `${bp}/surat-keterangan` },
                { name: "Surat Magang", href: `${bp}/surat-magang` },
                { name: "Surat Pengunduran Mahasiswa", href: `${bp}/surat-pengunduran-mahasiswa` },
                { name: "Surat Perpanjang Mahasiswa", href: `${bp}/surat-perpanjang-mahasiswa` },
                { name: "Surat Rekomendasi Kampus Mengajar", href: `${bp}/surat-rekomendasi-kampus-mengajar` },
                { name: "Surat Tunjangan", href: `${bp}/surat-tunjangan` },
            ]
        },
        {
            name: "Layanan Pasca Sarjana",
            icon: Inbox,
            subItems: [
                { name: "Surat Cuti", href: `${bp}/surat-cuti` },
                { name: "Surat Keluar", href: `${bp}/surat-keluar` },
                { name: "Surat Keterangan Aktif", href: `${bp}/surat-keterangan-aktif` },
                { name: "Surat Keterangan", href: `${bp}/surat-keterangan` },
                { name: "Surat Magang", href: `${bp}/surat-magang` },
                { name: "Surat Pengunduran Mahasiswa", href: `${bp}/surat-pengunduran-mahasiswa` },
                { name: "Surat Perpanjang Mahasiswa", href: `${bp}/surat-perpanjang-mahasiswa` },
                { name: "Surat Rekomendasi Kampus Mengajar", href: `${bp}/surat-rekomendasi-kampus-mengajar` },
                { name: "Surat Tunjangan", href: `${bp}/surat-tunjangan` },
            ]
        },
        {
            name: "Unit Kerja",
            icon: Inbox,
            subItems: [
                { name: "Surat Tugas", href: `${bp}/surat-Tugas` },
                { name: "SK Dekan", href: `${bp}/sk-dekan` },
                { name: "Surat Lainnya", href: `${bp}/surat-lainnya` },

            ]
        },

    ];

    const toggleSubmenu = (name: string) => {
        if (!open) setOpen(true);
        setOpenSubmenu(openSubmenu === name ? null : name);
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

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=${userData.basePath === '/div_sekolah' ? '059669' : '2563eb'}&color=fff&size=64`;

    return (
        /* SPACER DIV */
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
                <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
                    {/* Logo + Toggle */}
                    <div className="flex items-center justify-between px-4 py-6 shrink-0">
                        <img src="/images/logo-ssmi.png" alt="Logo" className="max-h-12 object-contain" />
                        <button
                            onClick={() => setOpen(!open)}
                            className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                            {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                        </button>
                    </div>

                    {/* Menu */}
                    <nav className="flex flex-col gap-1 px-3 flex-1">
                        {menu.map((item) => {
                            const hasSubItems = item.subItems && item.subItems.length > 0;
                            const isActive = item.href ? pathname === item.href : false;
                            const isSubmenuOpen = openSubmenu === item.name;

                            if (hasSubItems) {
                                return (
                                    <div key={item.name} className="flex flex-col">
                                        <button
                                            onClick={() => toggleSubmenu(item.name)}
                                            className={`
                                                flex items-center justify-between
                                                px-3 py-2.5 rounded-xl
                                                text-sm transition-all duration-200
                                                ${isSubmenuOpen ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                                {open && <span>{item.name}</span>}
                                            </div>
                                            {open && (
                                                <ChevronDown
                                                    size={16}
                                                    className={`transition-transform duration-200 ${isSubmenuOpen ? "rotate-180" : ""}`}
                                                />
                                            )}
                                        </button>

                                        {open && isSubmenuOpen && (
                                            <div className="flex flex-col mt-1 ml-4 pl-4 border-l border-gray-100 gap-1 animate-in slide-in-from-top-2 duration-200">
                                                {item.subItems?.map((sub) => {
                                                    const isSubActive = pathname === sub.href;
                                                    return (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            className={`
                                                                px-3 py-2 rounded-lg text-xs transition-all
                                                                ${isSubActive ? "text-blue-600 font-semibold bg-blue-50/50" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}
                                                            `}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href || "#"}
                                    className={`
                                        flex items-center gap-3
                                        px-3 py-2.5 rounded-xl
                                        text-sm transition-all duration-200
                                        ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
                                    `}
                                >
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                    {open && <span>{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* BOTTOM - PROFILE */}
                    <div className="px-3 py-4 mt-auto border-t border-gray-100 space-y-2">
                        <Link href={`${bp}/profile`} className="block">
                            <div className="flex items-center gap-3 rounded-xl hover:bg-gray-50 p-2 transition cursor-pointer group">
                                <div className="relative">
                                    <img
                                        src={avatarUrl}
                                        alt="profile"
                                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm"
                                    />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>

                                {open && (
                                    <div className="flex flex-col text-sm overflow-hidden items-start">
                                        <span className="font-semibold text-gray-800 truncate">
                                            {userData.name}
                                        </span>
                                        <span className="text-gray-500 text-[10px] tracking-wider uppercase font-medium">
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
                </div>
            </aside>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
