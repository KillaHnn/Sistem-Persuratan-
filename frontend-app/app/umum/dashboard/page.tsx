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
    ChevronLeft,
    AlertCircle,
    RotateCcw,
    Archive,
    Send,
} from "lucide-react";

// Import Komponen Per Role
import DashboardPemohon from "../components/DashboardPemohon";
import DashboardSekretariat from "../components/DashboardSekretariat";
import DashboardKabagTU from "../components/DashboardKabagTU";
import DashboardWadek from "../components/DashboardWadek";

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
    menunggu:      { label: "Menunggu",      color: "bg-orange-100 text-orange-700 border-orange-200",       icon: Send },
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
    surat_permohonan: "Surat Permohonan",
    surat_keputusan:  "Surat Keputusan",
    lainnya:          "Lainnya",
};

export default function DashboardPage() {
    const [surats, setSurats] = useState<SuratUmum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string>("pemohon"); // Default role
    const [userName, setUserName] = useState("User");
    const [activeFilter, setActiveFilter] = useState<string>("semua");
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 8;

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

    // Stats umum (Pemohon, KabagTU, Wadek) — dengan card Terkirim
    const stats = [
        { title: "Total Surat",   value: surats.length,                                                                                        icon: FileText,    color: "bg-orange-500", text: "text-orange-500" },
        { title: "Menunggu",      value: surats.filter(s => s.status === "menunggu").length,                                                   icon: Send,        color: "bg-amber-500",  text: "text-amber-500" },
        { title: "Diproses",      value: surats.filter(s => ["diproses", "diverifikasi", "ditandatangani"].includes(s.status)).length,          icon: Clock,       color: "bg-blue-500",   text: "text-blue-500" },
        { title: "Selesai",       value: surats.filter(s => s.status === "selesai" || s.status === "diarsipkan").length,                        icon: CheckCircle, color: "bg-green-500",  text: "text-green-500" },
        { title: "Dikembalikan",  value: surats.filter(s => s.status === "dikembalikan").length,                                               icon: XCircle,     color: "bg-red-500",    text: "text-red-500" },
    ];

    // Stats khusus sekretariat (6 card, termasuk Terkirim & Diarsipkan)
    const statsSekretariat = [
        { title: "Total Surat",   value: surats.length,                                                                                    icon: FileText,    color: "bg-orange-500", text: "text-orange-500" },
        { title: "Menunggu",      value: surats.filter(s => s.status === "menunggu").length,                                               icon: Send,        color: "bg-amber-500",  text: "text-amber-500" },
        { title: "Diproses",      value: surats.filter(s => ["diproses", "diverifikasi", "ditandatangani"].includes(s.status)).length,     icon: Clock,       color: "bg-blue-500",   text: "text-blue-500" },
        { title: "Selesai",       value: surats.filter(s => s.status === "selesai").length,                                                icon: CheckCircle, color: "bg-green-500",  text: "text-green-500" },
        { title: "Diarsipkan",    value: surats.filter(s => s.status === "diarsipkan").length,                                             icon: Archive,     color: "bg-purple-500", text: "text-purple-500" },
        { title: "Dikembalikan",  value: surats.filter(s => s.status === "dikembalikan").length,                                           icon: XCircle,     color: "bg-red-500",    text: "text-red-500" },
    ];

    // Filter tabs umum (Pemohon, KabagTU, Wadek)
    const filters = [
        { key: "semua", label: "Semua" },
        { key: "menunggu_tab", label: "Menunggu" },
        { key: "diproses", label: "Diproses" },
        { key: "dikembalikan", label: "Dikembalikan" },
        { key: "selesai_tab", label: "Selesai" },
    ];

    // Filter tabs khusus sekretariat
    const filtersSekretariat = [
        { key: "semua", label: "Semua" },
        { key: "menunggu_tab", label: "Menunggu" },
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
                    : activeFilter === "menunggu_tab"
                        ? surats.filter(s => s.status === "menunggu")
                        : activeFilter === "diproses"
                            ? surats.filter(s => ["diproses", "diverifikasi", "ditandatangani"].includes(s.status))
                            : surats.filter(s => s.status === activeFilter);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

    const getStatusInfo = (status: string) => {
        if (status === "diarsipkan" && userRole !== "sekretariat") {
            return { label: "Selesai", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle };
        }
        return STATUS_MAP[status] || { label: status, color: "bg-gray-100 text-gray-700 border-gray-200", icon: FileText };
    };

    const handleFilterChange = (key: string) => {
        setActiveFilter(key);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginatedList = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // Helper function untuk merender isi list agar tidak duplikasi code di komponen anak
    const renderListContainer = (titleLabel: string) => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-gray-50/40">
                <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-gray-800">{titleLabel}</h2>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
                        {filtered.length}
                    </span>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 overflow-x-auto gap-1 w-full sm:w-auto">
                    {activeFilters.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => handleFilterChange(f.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                                activeFilter === f.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 sm:p-5">
                {error && (
                    <div className="flex items-center gap-3 p-3.5 bg-red-50 text-red-700 rounded-xl mb-4 border border-red-100">
                        <AlertCircle size={18} />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-10 sm:py-14">
                        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                            <FileText size={28} />
                        </div>
                        <h3 className="text-gray-900 font-semibold text-sm sm:text-base">Belum ada surat</h3>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">
                            {activeFilter === "semua" ? "Tidak ada permohonan surat." : `Tidak ada surat dengan status "${activeFilters.find(f => f.key === activeFilter)?.label}".`}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-2.5 sm:space-y-3">
                            {paginatedList.map((surat) => {
                                const statusInfo = getStatusInfo(surat.status);
                                const StatusIcon = statusInfo.icon;
                                return (
                                    <Link
                                        key={surat.id}
                                        href={`/umum/riwayat/${surat.id}`}
                                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all bg-white cursor-pointer gap-3"
                                    >
                                        <div className="flex items-start gap-3 min-w-0">
                                            <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl hidden sm:flex shrink-0">
                                                <FileText size={20} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate text-sm sm:text-base">
                                                    {surat.perihal}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 text-xs text-gray-500">
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium text-gray-600">
                                                        {JENIS_MAP[surat.jenis_surat] || surat.jenis_surat}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{formatDate(surat.tgl_permohonan)}</span>
                                                    {userRole !== "pemohon" && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-orange-600 font-medium">Oleh: {surat.pemohon?.name}</span>
                                                        </>
                                                    )}
                                                    {surat.nomor_surat && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="font-mono text-gray-600">{surat.nomor_surat}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                                            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                                                <StatusIcon size={12} />
                                                {statusInfo.label}
                                            </span>
                                            <ChevronRight size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Pagination Bar */}
                        {totalPages > 1 && (
                            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <p className="text-xs text-gray-500">
                                    Menampilkan <span className="font-semibold text-gray-800">{(currentPage - 1) * PAGE_SIZE + 1}</span> - <span className="font-semibold text-gray-800">{Math.min(currentPage * PAGE_SIZE, filtered.length)}</span> dari <span className="font-semibold text-gray-800">{filtered.length}</span> surat
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-1.5 sm:px-3 sm:py-1 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
                                    >
                                        <ChevronLeft size={14} />
                                        <span className="hidden sm:inline">Sebelumnya</span>
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                            .map((p, idx, arr) => {
                                                const prev = arr[idx - 1];
                                                return (
                                                    <div key={p} className="flex items-center">
                                                        {prev && p - prev > 1 && (
                                                            <span className="px-1 text-gray-400 text-xs">...</span>
                                                        )}
                                                        <button
                                                            onClick={() => setCurrentPage(p)}
                                                            className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-medium transition ${
                                                                currentPage === p
                                                                    ? "bg-orange-500 text-white shadow-sm font-semibold"
                                                                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                                            }`}
                                                        >
                                                            {p}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-1.5 sm:px-3 sm:py-1 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
                                    >
                                        <span className="hidden sm:inline">Berikutnya</span>
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
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
        default:
            return <DashboardPemohon {...sharedProps} userName={userName} />;
    }
}