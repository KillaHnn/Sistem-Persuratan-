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

// Import Komponen Per Role
import DashboardPemohon from "../components/DashboardPemohon";
import DashboardSekretariat from "../components/DashboardSekretariat";
import DashboardKabagTU from "../components/DashboardKabagTU";
import DashboardWadek from "../components/DashboardWadek";
import DashboardDekan from "../components/DashboardDekan";

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
    diproses:      { label: "Diproses",      color: "bg-blue-100 text-blue-700 border-blue-200",         icon: Clock },
    dikembalikan:  { label: "Dikembalikan",  color: "bg-red-100 text-red-700 border-red-200",            icon: RotateCcw },
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
    const [userRole, setUserRole] = useState<string>("pemohon"); // Default role
    const [userName, setUserName] = useState("User");
    const [activeFilter, setActiveFilter] = useState<string>("semua");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserName(user.name || user.username || "User");
            setUserRole(user.role || "pemohon"); // Pastikan API backend kamu mengirim data field 'role'
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
        { title: "Total Surat",   value: surats.length,                                                     icon: FileText,    color: "bg-orange-500", text: "text-orange-500" },
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

    // Helper function untuk merender isi list agar tidak duplikasi code di komponen anak
    const renderListContainer = (titleLabel: string) => (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">{titleLabel}</h2>
                <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200 overflow-x-auto gap-1">
                    {filters.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setActiveFilter(f.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                activeFilter === f.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

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
                            {activeFilter === "semua" ? "Tidak ada permohonan surat." : `Tidak ada surat dengan status "${filters.find(f => f.key === activeFilter)?.label}".`}
                        </p>
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
                                                {/* Menampilkan nama pemohon jika login sebagai Sekretariat/Kabag TU */}
                                                {userRole !== "pemohon" && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="text-orange-600 font-medium">Oleh: {surat.pemohon?.name}</span>
                                                    </>
                                                )}
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
    );

    // Kumpulan props yang akan dioper ke komponen anak
    const sharedProps = { surats, stats, filters, activeFilter, setActiveFilter, filtered, formatDate, STATUS_MAP, JENIS_MAP, renderListContainer };

    // Render komponen berdasarkan role user
    switch (userRole) {
        case "pemohon":
            return <DashboardPemohon {...sharedProps} userName={userName} />;
        case "sekretariat":
            return <DashboardSekretariat {...sharedProps} />;
        case "kabag_tu":
            return <DashboardKabagTU {...sharedProps} />;
        case "wakil_dekan":
            return <DashboardWadek {...sharedProps} />;
        case "dekan":
            return <DashboardDekan {...sharedProps} />;
        default:
            return <DashboardPemohon {...sharedProps} userName={userName} />;
    }
}