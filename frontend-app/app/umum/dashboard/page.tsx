"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    FilePlus2,
    ChevronRight,
    AlertCircle,
    RotateCcw,
    Archive,
} from "lucide-react";

type SuratUmum = {
    id: number;
    jenis_surat: string;
    perihal: string;
    nomor_surat: string | null;
    status: string;
    tgl_permohonan: string;
    pemohon: { name: string };
};

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
    menunggu:      { label: "Menunggu",      color: "bg-yellow-100 text-yellow-700 border-yellow-200",  icon: Clock },
    diproses:      { label: "Diproses",      color: "bg-blue-100 text-blue-700 border-blue-200",        icon: Clock },
    dikembalikan:  { label: "Dikembalikan",  color: "bg-orange-100 text-orange-700 border-orange-200",  icon: RotateCcw },
    diverifikasi:  { label: "Diverifikasi",  color: "bg-purple-100 text-purple-700 border-purple-200",  icon: CheckCircle },
    ditandatangani:{ label: "Ditandatangani",color: "bg-green-100 text-green-700 border-green-200",     icon: CheckCircle },
    diarsipkan:    { label: "Diarsipkan",    color: "bg-gray-100 text-gray-700 border-gray-200",        icon: Archive },
};

const JENIS_MAP: Record<string, string> = {
    undangan:         "Undangan",
    surat_tugas:      "Surat Tugas",
    surat_pengantar:  "Surat Pengantar",
    surat_keterangan: "Surat Keterangan",
    lainnya:          "Lainnya",
};

export default function DashboardPage() {
    const [surats, setSurats] = useState<SuratUmum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userName, setUserName] = useState("User");
    const [activeFilter, setActiveFilter] = useState<string>("semua");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserName(user.name || user.username || "User");
        }
        fetchSurats();
    }, []);

    const getToken = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("token") || "";
        }
        return "";
    };

    const fetchSurats = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://127.0.0.1:8000/api/umum/surat", {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    Accept: "application/json",
                },
            });
            if (!res.ok) throw new Error("Gagal memuat data surat");
            const data = await res.json();
            setSurats(data.data || []);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    // Stats
    const stats = [
        { title: "Total Surat",   value: surats.length,                                        icon: FileText,    color: "bg-orange-500", text: "text-orange-500" },
        { title: "Menunggu",      value: surats.filter(s => s.status === "menunggu").length,    icon: Clock,       color: "bg-yellow-500", text: "text-yellow-500" },
        { title: "Selesai",       value: surats.filter(s => s.status === "ditandatangani" || s.status === "diarsipkan").length, icon: CheckCircle, color: "bg-green-500", text: "text-green-500" },
        { title: "Dikembalikan",  value: surats.filter(s => s.status === "dikembalikan").length,icon: XCircle,     color: "bg-red-500",    text: "text-red-500" },
    ];

    const filters = [
        { key: "semua", label: "Semua" },
        { key: "menunggu", label: "Menunggu" },
        { key: "diproses", label: "Diproses" },
        { key: "dikembalikan", label: "Dikembalikan" },
        { key: "ditandatangani", label: "Selesai" },
    ];

    const filtered = activeFilter === "semua"
        ? surats
        : surats.filter(s => s.status === activeFilter);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1">Selamat datang kembali, {userName}!</p>
                </div>
                <Link
                    href="/umum/buat-surat"
                    className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 active:scale-95"
                >
                    <FilePlus2 size={18} />
                    <span className="font-medium">Buat Surat Baru</span>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                                <stat.icon size={22} className={stat.text} />
                            </div>
                            <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Daftar Permohonan Surat</h2>

                    {/* Filter Tabs */}
                    <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200 overflow-x-auto gap-1">
                        {filters.map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setActiveFilter(f.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                    activeFilter === f.key
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="p-6">
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl mb-4 border border-red-100">
                            <AlertCircle size={18} />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-gray-900 font-medium">Belum ada surat</h3>
                            <p className="text-gray-500 text-sm mt-1">
                                {activeFilter === "semua"
                                    ? "Anda belum pernah mengajukan surat."
                                    : `Tidak ada surat dengan status "${filters.find(f => f.key === activeFilter)?.label}".`}
                            </p>
                            <Link
                                href="/umum/buat-surat"
                                className="inline-flex items-center gap-2 mt-4 bg-orange-500 text-white text-sm px-4 py-2 rounded-xl hover:bg-orange-600 transition"
                            >
                                <FilePlus2 size={16} />
                                Buat Surat Pertama Anda
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map((surat) => {
                                const statusInfo = STATUS_MAP[surat.status] || { label: surat.status, color: "bg-gray-100 text-gray-700 border-gray-200", icon: FileText };
                                const StatusIcon = statusInfo.icon;
                                return (
                                    <Link
                                        key={surat.id}
                                        href={`/umum/riwayat/${surat.id}`}
                                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all bg-white cursor-pointer"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-orange-50 text-orange-500 rounded-xl hidden sm:flex shrink-0">
                                                <FileText size={22} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                                                    {surat.perihal}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded-md">
                                                        {JENIS_MAP[surat.jenis_surat] || surat.jenis_surat}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{formatDate(surat.tgl_permohonan)}</span>
                                                    {surat.nomor_surat && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="font-mono">{surat.nomor_surat}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mt-4 sm:mt-0 shrink-0">
                                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                                                <StatusIcon size={12} />
                                                {statusInfo.label}
                                            </span>
                                            <ChevronRight size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
