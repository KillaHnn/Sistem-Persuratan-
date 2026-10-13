"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    FileText, Clock, CheckCircle, RotateCcw,
    Archive, ChevronRight, ChevronLeft, AlertCircle, Search, X, Calendar, Send,
} from "lucide-react";

type SuratUmum = {
    id: number;
    jenis_surat: string;
    perihal: string;
    nomor_surat: string | null;
    status: string;
    tgl_permohonan: string;
    hasil_arsip: string | null;
};

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
    menunggu: { label: "Menunggu", color: "bg-orange-100 text-orange-700 border-orange-200", icon: Send },
    diproses: { label: "Diproses", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
    dikembalikan: { label: "Dikembalikan", color: "bg-red-100 text-red-700 border-red-200", icon: RotateCcw },
    diverifikasi: { label: "Diproses", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
    ditandatangani: { label: "Diproses", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
    selesai: { label: "Selesai", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
    diarsipkan: { label: "Diarsipkan", color: "bg-gray-100 text-gray-700 border-gray-200", icon: Archive },
};

const JENIS_MAP: Record<string, string> = {
    undangan: "Undangan",
    surat_tugas: "Surat Tugas",
    surat_pengantar: "Surat Pengantar",
    surat_keterangan: "Surat Keterangan",
    surat_permohonan: "Surat Permohonan",
    surat_keputusan: "Surat Keputusan",
    lainnya: "Lainnya",
};

const emptyForm = { tahun: "", bulan: "", jenis_surat: "", nomor_surat: "", perihal: "" };

const BULAN_MAP: Record<string, string> = {
    "1": "Januari", "2": "Februari", "3": "Maret", "4": "April",
    "5": "Mei", "6": "Juni", "7": "Juli", "8": "Agustus",
    "9": "September", "10": "Oktober", "11": "November", "12": "Desember",
};

type SearchModalProps = {
    title: string;
    subtitle: string;
    form: typeof emptyForm;
    onChange: (form: typeof emptyForm) => void;
    onApply: () => void;
    onReset: () => void;
    onClose: () => void;
    matchingNomorSurat?: string[];
    availableTahun?: string[];
};

function SearchModal({ title, subtitle, form, onChange, onApply, onReset, onClose, matchingNomorSurat = [], availableTahun = [] }: SearchModalProps) {
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [yearPage, setYearPage] = useState(0); // for pagination of years grid
    const yearPickerRef = useRef<HTMLDivElement>(null);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const monthPickerRef = useRef<HTMLDivElement>(null);

    // Generate years range: current year down to 2000
    const currentYear = new Date().getFullYear();
    const allYears: number[] = [];
    for (let y = currentYear; y >= 2000; y--) allYears.push(y);
    const yearsPerPage = 12;
    const totalPages = Math.ceil(allYears.length / yearsPerPage);
    const pagedYears = allYears.slice(yearPage * yearsPerPage, (yearPage + 1) * yearsPerPage);

    // Close year picker on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (yearPickerRef.current && !yearPickerRef.current.contains(e.target as Node)) {
                setShowYearPicker(false);
            }
        };
        if (showYearPicker) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showYearPicker]);

    // Close month picker on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (monthPickerRef.current && !monthPickerRef.current.contains(e.target as Node)) {
                setShowMonthPicker(false);
            }
        };
        if (showMonthPicker) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMonthPicker]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
                <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 text-orange-500 rounded-xl">
                            <Search size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-gray-900">{title}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 bg-white rounded-full border border-gray-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                    <div className="relative" ref={yearPickerRef}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tahun Surat</label>
                        <button
                            type="button"
                            onClick={() => setShowYearPicker(!showYearPicker)}
                            className={`w-full p-3 border rounded-xl text-sm text-left flex items-center justify-between transition ${
                                showYearPicker
                                    ? "border-orange-500 ring-2 ring-orange-100 bg-white"
                                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                            }`}
                        >
                            <span className={form.tahun ? "text-gray-900 font-medium" : "text-gray-400"}>
                                {form.tahun || "Pilih tahun..."}
                            </span>
                            <Calendar size={16} className={showYearPicker ? "text-orange-500" : "text-gray-400"} />
                        </button>

                        {showYearPicker && (
                            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-10 p-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* Navigation */}
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <button
                                        type="button"
                                        onClick={() => setYearPage(p => Math.max(0, p - 1))}
                                        disabled={yearPage === 0}
                                        className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                    >
                                        <ChevronLeft size={16} className="text-gray-600" />
                                    </button>
                                    <span className="text-xs font-medium text-gray-500">
                                        {pagedYears[pagedYears.length - 1]} – {pagedYears[0]}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setYearPage(p => Math.min(totalPages - 1, p + 1))}
                                        disabled={yearPage >= totalPages - 1}
                                        className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                    >
                                        <ChevronRight size={16} className="text-gray-600" />
                                    </button>
                                </div>
                                {/* Year grid */}
                                <div className="grid grid-cols-4 gap-1.5">
                                    {pagedYears.map(y => {
                                        const ys = y.toString();
                                        const hasData = availableTahun.includes(ys);
                                        const isSelected = form.tahun === ys;
                                        return (
                                            <button
                                                key={y}
                                                type="button"
                                                onClick={() => {
                                                    onChange({ ...form, tahun: ys, bulan: "", nomor_surat: "" });
                                                    setShowYearPicker(false);
                                                }}
                                                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                                                    isSelected
                                                        ? "bg-orange-500 text-white shadow-sm"
                                                        : hasData
                                                            ? "bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200"
                                                            : "text-gray-400 hover:bg-gray-50 cursor-default"
                                                }`}
                                                disabled={!hasData}
                                            >
                                                {y}
                                            </button>
                                        );
                                    })}
                                </div>
                                {/* Clear button */}
                                {form.tahun && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onChange({ ...form, tahun: "", bulan: "", nomor_surat: "" });
                                            setShowYearPicker(false);
                                        }}
                                        className="w-full mt-2 py-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition font-medium"
                                    >
                                        Hapus pilihan tahun
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="relative" ref={monthPickerRef}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bulan Surat</label>
                        <button
                            type="button"
                            onClick={() => setShowMonthPicker(!showMonthPicker)}
                            className={`w-full p-3 border rounded-xl text-sm text-left flex items-center justify-between transition ${
                                showMonthPicker
                                    ? "border-orange-500 ring-2 ring-orange-100 bg-white"
                                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                            }`}
                        >
                            <span className={form.bulan ? "text-gray-900 font-medium" : "text-gray-400"}>
                                {form.bulan ? BULAN_MAP[form.bulan] : "Pilih bulan..."}
                            </span>
                            <Calendar size={16} className={showMonthPicker ? "text-orange-500" : "text-gray-400"} />
                        </button>

                        {showMonthPicker && (
                            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-10 p-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* Month grid */}
                                <div className="grid grid-cols-3 gap-1.5">
                                    {Object.entries(BULAN_MAP).map(([k, v]) => {
                                        const isSelected = form.bulan === k;
                                        return (
                                            <button
                                                key={k}
                                                type="button"
                                                onClick={() => {
                                                    onChange({ ...form, bulan: k, nomor_surat: "" });
                                                    setShowMonthPicker(false);
                                                }}
                                                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                                                    isSelected
                                                        ? "bg-orange-500 text-white shadow-sm"
                                                        : "bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200"
                                                }`}
                                            >
                                                {v}
                                            </button>
                                        );
                                    })}
                                </div>
                                {/* Clear button */}
                                {form.bulan && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onChange({ ...form, bulan: "", nomor_surat: "" });
                                            setShowMonthPicker(false);
                                        }}
                                        className="w-full mt-2 py-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition font-medium"
                                    >
                                        Hapus pilihan bulan
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jenis Surat</label>
                        <select
                            value={form.jenis_surat}
                            onChange={e => onChange({ ...form, jenis_surat: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 bg-gray-50"
                        >
                            <option value="">-- Semua Jenis --</option>
                            {Object.entries(JENIS_MAP).map(([k, v]) => (
                                <option key={k} value={k}>{v}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">No Surat</label>
                        {form.tahun && form.bulan && matchingNomorSurat.length > 0 ? (
                            <>
                                <select
                                    value={form.nomor_surat}
                                    onChange={e => onChange({ ...form, nomor_surat: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 bg-gray-50 font-mono"
                                >
                                    <option value="">-- Pilih Nomor Surat --</option>
                                    {matchingNomorSurat.map((nomor, idx) => (
                                        <option key={idx} value={nomor}>{nomor}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-400 mt-1">
                                    Ditemukan {matchingNomorSurat.length} nomor surat di {BULAN_MAP[form.bulan]} {form.tahun}
                                </p>
                            </>
                        ) : form.tahun && form.bulan && matchingNomorSurat.length === 0 ? (
                            <>
                                <input
                                    type="text"
                                    placeholder="Contoh: 123/UN.1/DT/2026"
                                    value={form.nomor_surat}
                                    onChange={e => onChange({ ...form, nomor_surat: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 bg-gray-50 font-mono"
                                />
                                <p className="text-xs text-orange-500 mt-1">
                                    Tidak ada nomor surat di {BULAN_MAP[form.bulan]} {form.tahun}
                                </p>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    placeholder="Contoh: 123/UN.1/DT/2026"
                                    value={form.nomor_surat}
                                    onChange={e => onChange({ ...form, nomor_surat: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 bg-gray-50 font-mono"
                                />
                                {!form.tahun || !form.bulan ? (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Isi tahun dan bulan untuk melihat daftar nomor surat
                                    </p>
                                ) : null}
                            </>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Perihal Surat</label>
                        <input
                            type="text"
                            placeholder="Kata kunci perihal surat..."
                            value={form.perihal}
                            onChange={e => onChange({ ...form, perihal: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 bg-gray-50"
                        />
                    </div>
                </div>

                <div className="p-5 sm:p-6 border-t border-gray-100 flex gap-3 bg-gray-50/50">
                    <button
                        type="button"
                        onClick={onReset}
                        className="flex-1 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition text-sm"
                    >
                        Reset
                    </button>
                    <button
                        type="button"
                        onClick={onApply}
                        className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition text-sm flex items-center justify-center gap-2"
                    >
                        <Search size={16} />
                        Cari
                    </button>
                </div>
            </div>
        </div>
    );
}
const PAGE_SIZE = 10;

export default function RiwayatPage() {
    const [surats, setSurats] = useState<SuratUmum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState("semua");
    const [userRole, setUserRole] = useState<string>("pemohon");
    const [currentPage, setCurrentPage] = useState(1);

    // --- Pemohon: modal cari surat ---
    const [showCariModal, setShowCariModal] = useState(false);
    const [cariForm, setCariForm] = useState({ ...emptyForm });
    const [cariApplied, setCariApplied] = useState({ ...emptyForm });
    const [hasSearched, setHasSearched] = useState(false);

    // --- Sekretariat: modal cari arsip ---
    const [showArsipModal, setShowArsipModal] = useState(false);
    const [arsipForm, setArsipForm] = useState({ ...emptyForm });
    const [arsipApplied, setArsipApplied] = useState({ ...emptyForm });
    const [hasArsipSearched, setHasArsipSearched] = useState(false);

    const getToken = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("token") || "";
        }
        return "";
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserRole(user.role || "pemohon");
        }
        const fetchSurats = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
                const res = await fetch(`${baseUrl}/api/umum/surat`, {
                    headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
                });
                if (!res.ok) throw new Error("Gagal memuat data");
                const data = await res.json();
                setSurats(data.data || []);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSurats();
    }, []);

    const getStatusInfo = (status: string) => {
        if (status === "diarsipkan" && userRole !== "sekretariat") {
            return { label: "Selesai", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle };
        }
        return STATUS_MAP[status] || { label: status, color: "bg-gray-100 text-gray-700 border-gray-200", icon: FileText };
    };

    // Tab filter khusus sekretariat
    const sekretariatTabs = [
        { key: "semua", label: "Semua Arsip" },
        { key: "berhasil", label: "Arsip (Selesai/Berhasil)" },
        { key: "ditolak", label: "Arsip (Dikembalikan/Ditolak)" },
    ];

    // Filter list berdasarkan role
    const displayList = surats.filter(s => {
        if (userRole === "sekretariat") {
            // Hanya arsip
            if (s.status !== "diarsipkan") return false;
            // Tab status
            if (filterStatus === "berhasil" && s.hasil_arsip !== "berhasil") return false;
            if (filterStatus === "ditolak" && s.hasil_arsip !== "ditolak") return false;
            // Filter dari modal cari arsip
            if (hasArsipSearched) {
                const tahun = arsipApplied.tahun.trim();
                const bulan = arsipApplied.bulan.trim();
                const jenis = arsipApplied.jenis_surat.trim();
                const nomor = arsipApplied.nomor_surat.trim().toLowerCase();
                const perihal = arsipApplied.perihal.trim().toLowerCase();
                if (tahun && !new Date(s.tgl_permohonan).getFullYear().toString().includes(tahun)) return false;
                if (bulan && (new Date(s.tgl_permohonan).getMonth() + 1).toString() !== bulan) return false;
                if (jenis && s.jenis_surat !== jenis) return false;
                if (nomor && !(s.nomor_surat || "").toLowerCase().includes(nomor)) return false;
                if (perihal && !s.perihal.toLowerCase().includes(perihal)) return false;
            }
            return true;
        }
        // Pemohon: filter dari modal cari
        if (hasSearched) {
            const tahun = cariApplied.tahun.trim();
            const bulan = cariApplied.bulan.trim();
            const jenis = cariApplied.jenis_surat.trim();
            const nomor = cariApplied.nomor_surat.trim().toLowerCase();
            const perihal = cariApplied.perihal.trim().toLowerCase();
            if (tahun && !new Date(s.tgl_permohonan).getFullYear().toString().includes(tahun)) return false;
            if (bulan && (new Date(s.tgl_permohonan).getMonth() + 1).toString() !== bulan) return false;
            if (jenis && s.jenis_surat !== jenis) return false;
            if (nomor && !(s.nomor_surat || "").toLowerCase().includes(nomor)) return false;
            if (perihal && !s.perihal.toLowerCase().includes(perihal)) return false;
        }
        return true;
    });

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

    // Modal cari surat (pemohon)
    const handleApplyCari = () => {
        setCariApplied({ ...cariForm });
        setHasSearched(true);
        setCurrentPage(1);
        setShowCariModal(false);
    };
    const handleResetCari = () => {
        setCariForm({ ...emptyForm });
        setCariApplied({ ...emptyForm });
        setHasSearched(false);
        setCurrentPage(1);
        setShowCariModal(false);
    };
    const hasActiveFilter = hasSearched && Object.values(cariApplied).some(v => v.trim() !== "");

    // Modal cari arsip (sekretariat)
    const handleApplyArsip = () => {
        setArsipApplied({ ...arsipForm });
        setHasArsipSearched(true);
        setCurrentPage(1);
        setShowArsipModal(false);
    };
    const handleResetArsip = () => {
        setArsipForm({ ...emptyForm });
        setArsipApplied({ ...emptyForm });
        setHasArsipSearched(false);
        setCurrentPage(1);
        setShowArsipModal(false);
    };
    const hasArsipFilter = hasArsipSearched && Object.values(arsipApplied).some(v => v.trim() !== "");

    // Helper: get daftar tahun unik dari data surat
    const getAvailableTahun = (data: SuratUmum[]): string[] => {
        const years = data
            .map(s => new Date(s.tgl_permohonan).getFullYear().toString())
            .filter(Boolean);
        return [...new Set(years)].sort((a, b) => Number(b) - Number(a));
    };

    // Helper: get nomor surat yang cocok dengan tahun+bulan dari form
    const getMatchingNomorSurat = (form: typeof emptyForm, data: SuratUmum[]): string[] => {
        const tahun = form.tahun.trim();
        const bulan = form.bulan.trim();
        if (!tahun || !bulan) return [];
        const matched = data
            .filter(s => {
                const d = new Date(s.tgl_permohonan);
                return d.getFullYear().toString() === tahun && (d.getMonth() + 1).toString() === bulan && s.nomor_surat;
            })
            .map(s => s.nomor_surat as string);
        // Remove duplicates
        return [...new Set(matched)];
    };
    // Pagination
    const totalPages = Math.ceil(displayList.length / PAGE_SIZE);
    const paginatedList = displayList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header compact */}
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">Riwayat Surat</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        {userRole === "sekretariat"
                            ? "Semua surat yang masuk ke sekretariat"
                            : "Permohonan surat yang pernah Anda ajukan"}
                    </p>
                </div>
                <button
                    onClick={() => {
                        if (userRole === "sekretariat") {
                            setArsipForm({ ...arsipApplied });
                            setShowArsipModal(true);
                        } else {
                            setCariForm({ ...cariApplied });
                            setShowCariModal(true);
                        }
                    }}
                    className="flex items-center gap-1.5 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition shadow-sm active:scale-95 text-sm font-medium shrink-0"
                >
                    <Search size={18} />
                    <span>Cari Surat</span>
                </button>
            </div>

            {/* Badge filter aktif (pemohon) */}
            {userRole !== "sekretariat" && hasActiveFilter && (
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-medium text-gray-600 text-xs">Filter aktif:</span>
                    {cariApplied.tahun && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Tahun: {cariApplied.tahun}</span>}
                    {cariApplied.bulan && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Bulan: {BULAN_MAP[cariApplied.bulan]}</span>}
                    {cariApplied.jenis_surat && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Jenis: {JENIS_MAP[cariApplied.jenis_surat] || cariApplied.jenis_surat}</span>}
                    {cariApplied.nomor_surat && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">No: {cariApplied.nomor_surat}</span>}
                    {cariApplied.perihal && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Perihal: {cariApplied.perihal}</span>}
                    <button onClick={handleResetCari} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium"><X size={13} /> Reset</button>
                </div>
            )}

            {/* Badge filter aktif (sekretariat) */}
            {userRole === "sekretariat" && hasArsipFilter && (
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-medium text-gray-600 text-xs">Filter aktif:</span>
                    {arsipApplied.tahun && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Tahun: {arsipApplied.tahun}</span>}
                    {arsipApplied.bulan && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Bulan: {BULAN_MAP[arsipApplied.bulan]}</span>}
                    {arsipApplied.jenis_surat && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Jenis: {JENIS_MAP[arsipApplied.jenis_surat] || arsipApplied.jenis_surat}</span>}
                    {arsipApplied.nomor_surat && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">No: {arsipApplied.nomor_surat}</span>}
                    {arsipApplied.perihal && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-medium">Perihal: {arsipApplied.perihal}</span>}
                    <button onClick={handleResetArsip} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium"><X size={13} /> Reset</button>
                </div>
            )}

            {/* Tab Status — hanya sekretariat, di luar modal */}
            {userRole === "sekretariat" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4">
                    <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200 overflow-x-auto gap-1">
                        {sekretariatTabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setFilterStatus(tab.key)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${filterStatus === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* List */}
            <div className="space-y-3 sm:space-y-4">
                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
                        <AlertCircle size={18} />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {loading ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
                    ))
                ) : displayList.length === 0 ? (
                    <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-gray-900 font-medium">Tidak ada surat ditemukan</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            {hasArsipFilter || hasActiveFilter
                                ? "Tidak ada hasil untuk filter yang dipilih"
                                : "Belum ada riwayat surat"}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-2.5 sm:space-y-3">
                            {paginatedList.map((surat) => {
                                const st = getStatusInfo(surat.status);
                                const StIcon = st.icon;
                                return (
                                    <Link key={surat.id} href={`/umum/riwayat/${surat.id}`}
                                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-gray-100 bg-white hover:border-orange-200 hover:shadow-md transition-all gap-3 sm:gap-4">
                                        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                                            <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl hidden sm:flex shrink-0">
                                                <FileText size={20} />
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
                                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${st.color}`}>
                                                <StIcon size={12} />
                                                {st.label}
                                            </span>
                                            <ChevronRight size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Pagination Bar */}
                        {totalPages > 1 && (
                            <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                                <p className="text-xs sm:text-sm text-gray-500">
                                    Menampilkan <span className="font-semibold text-gray-800">{(currentPage - 1) * PAGE_SIZE + 1}</span> - <span className="font-semibold text-gray-800">{Math.min(currentPage * PAGE_SIZE, displayList.length)}</span> dari <span className="font-semibold text-gray-800">{displayList.length}</span> surat
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
                                    >
                                        <ChevronLeft size={16} />
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
                                                            className={`min-w-[32px] h-8 px-2 rounded-xl text-xs font-medium transition ${
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
                                        className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
                                    >
                                        <span className="hidden sm:inline">Berikutnya</span>
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ===== MODAL CARI SURAT (Pemohon) ===== */}
            {showCariModal && (
                <SearchModal
                    title="Cari Surat"
                    subtitle="Masukkan kriteria pencarian surat"
                    form={cariForm}
                    onChange={f => setCariForm(f)}
                    onApply={handleApplyCari}
                    onReset={handleResetCari}
                    onClose={() => setShowCariModal(false)}
                    matchingNomorSurat={getMatchingNomorSurat(cariForm, surats)}
                    availableTahun={getAvailableTahun(surats)}
                />
            )}

            {/* ===== MODAL CARI ARSIP (Sekretariat) ===== */}
            {showArsipModal && (
                <SearchModal
                    title="Cari Arsip Surat"
                    subtitle="Masukkan kriteria pencarian arsip"
                    form={arsipForm}
                    onChange={f => setArsipForm(f)}
                    onApply={handleApplyArsip}
                    onReset={handleResetArsip}
                    onClose={() => setShowArsipModal(false)}
                    matchingNomorSurat={getMatchingNomorSurat(arsipForm, surats.filter(s => s.status === "diarsipkan"))}
                    availableTahun={getAvailableTahun(userRole === "sekretariat" ? surats.filter(s => s.status === "diarsipkan") : surats)}
                />
            )}
        </div>
    );
}
