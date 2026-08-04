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
    menunggu:      { label: "Diproses",      color: "bg-blue-100 text-blue-700 border-blue-200",         icon: Clock },
    diproses:      { label: "Diproses",      color: "bg-blue-100 text-blue-700 border-blue-200",         icon: Clock },
    dikembalikan:  { label: "Dikembalikan",  color: "bg-red-100 text-red-700 border-red-200",            icon: RotateCcw },
    diverifikasi:  { label: "Diproses",      color: "bg-blue-100 text-blue-700 border-blue-200",         icon: Clock },
    ditandatangani:{ label: "Diproses",      color: "bg-blue-100 text-blue-700 border-blue-200",         icon: Clock },
    selesai:       { label: "Selesai",       color: "bg-green-100 text-green-700 border-green-200",     icon: CheckCircle },
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
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const res = await fetch(`${baseUrl}/api/umum/surat`, {
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

    // Stats — sekretariat mendapat card tambahan "Diarsipkan"
    const stats = [
        { title: "Total Surat",   value: surats.length,                                                                                    icon: FileText,    color: "bg-orange-500", text: "text-orange-500" },
        { title: "Diproses",      value: surats.filter(s => ["menunggu", "diproses", "diverifikasi", "ditandatangani"].includes(s.status)).length, icon: Clock,       color: "bg-blue-500",   text: "text-blue-500" },
        { title: "Selesai",       value: surats.filter(s => s.status === "selesai" || s.status === "diarsipkan").length,                    icon: CheckCircle, color: "bg-green-500",  text: "text-green-500" },
        { title: "Dikembalikan",  value: surats.filter(s => s.status === "dikembalikan").length,                                           icon: XCircle,     color: "bg-red-500",    text: "text-red-500" },
    ];

    // Stats khusus sekretariat (5 card, termasuk Diarsipkan)
    const statsSekretariat = [
        { title: "Total Surat",   value: surats.length,                                                                                    icon: FileText,    color: "bg-orange-500", text: "text-orange-500" },
        { title: "Diproses",      value: surats.filter(s => ["menunggu", "diproses", "diverifikasi", "ditandatangani"].includes(s.status)).length, icon: Clock,       color: "bg-blue-500",   text: "text-blue-500" },
        { title: "Selesai",       value: surats.filter(s => s.status === "selesai").length,                                                icon: CheckCircle, color: "bg-green-500",  text: "text-green-500" },
        { title: "Diarsipkan",    value: surats.filter(s => s.status === "diarsipkan").length,                                             icon: Archive,     color: "bg-purple-500", text: "text-purple-500" },
        { title: "Dikembalikan",  value: surats.filter(s => s.status === "dikembalikan").length,                                           icon: XCircle,     color: "bg-red-500",    text: "text-red-500" },
    ];

    // Filter tabs umum
    const filters = [
        { key: "semua", label: "Semua" },
        { key: "diproses", label: "Diproses" },
        { key: "dikembalikan", label: "Dikembalikan" },
        { key: "selesai_tab", label: "Selesai" },
    ];

    // Filter tabs khusus sekretariat
    const filtersSekretariat = [
        { key: "semua", label: "Semua" },
        { key: "diproses", label: "Diproses" },
        { key: "berhasil", label: "Berhasil" },
        { key: "diarsipkan_tab", label: "Diarsipkan" },
        { key: "dikembalikan", label: "Dikembalikan" },
    ];

    const activeFilters = userRole === "sekretariat" ? filtersSekretariat : filters;

    const filtered = activeFilter === "semua"
        ? surats
        : activeFilter === "selesai_tab"
            ? surats.filter(s => s.status === "selesai" || s.status === "diarsipkan")
            : activeFilter === "berhasil"
                ? surats.filter(s => s.status === "selesai")
                : activeFilter === "diarsipkan_tab"
                    ? surats.filter(s => s.status === "diarsipkan")
                    : activeFilter === "diproses"
                        ? surats.filter(s => ["menunggu", "diproses", "diverifikasi", "ditandatangani"].includes(s.status))
                        : surats.filter(s => s.status === activeFilter);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

    const getStatusInfo = (status: string) => {
        if (status === "diarsipkan" && userRole !== "sekretariat") {
            return { label: "Selesai", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle };
        }
        return STATUS_MAP[status] || { label: status, color: "bg-gray-100 text-gray-700 border-gray-200", icon: FileText };
    };

    // Helper function untuk merender isi list agar tidak duplikasi code di komponen anak
    const renderListContainer = (titleLabel: string) => (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">{titleLabel}</h2>
                <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200 overflow-x-auto gap-1 w-full sm:w-auto">
                    {filters.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setActiveFilter(f.key)}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                                activeFilter === f.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 sm:p-6">
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
                    <div className="text-center py-12 sm:py-16">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-gray-900 font-medium">Belum ada surat</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            {activeFilter === "semua" ? "Tidak ada permohonan surat." : `Tidak ada surat dengan status "${filters.find(f => f.key === activeFilter)?.label}".`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {filtered.map((surat) => {
                            const statusInfo = getStatusInfo(surat.status);
                            const StatusIcon = statusInfo.icon;
                            return (
                                <Link
                                    key={surat.id}
                                    href={`/umum/riwayat/${surat.id}`}
                                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all bg-white cursor-pointer gap-3 sm:gap-4"
                                >
                                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                                        <div className="p-3 bg-orange-50 text-orange-500 rounded-xl hidden sm:flex shrink-0">
                                            <FileText size={22} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate text-sm sm:text-base">
                                                {surat.perihal}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 text-xs text-gray-500">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium">
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
                                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
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
    const sharedProps = { surats, stats, filters: activeFilters, activeFilter, setActiveFilter, filtered, formatDate, STATUS_MAP, JENIS_MAP, renderListContainer };
    const sekretariatProps = { ...sharedProps, stats: statsSekretariat };

    // Render komponen berdasarkan role user
    switch (userRole) {
        case "pemohon":
            return <DashboardPemohon {...sharedProps} userName={userName} />;
        case "sekretariat":
            return <DashboardSekretariat {...sekretariatProps} />;
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